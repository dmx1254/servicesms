import { NextResponse } from 'next/server';
import { PaymentService } from '@/app/services/PaymentService';
import { getServerSession } from "next-auth";
import { options } from '@/app/api/auth/[...nextauth]/option';
import { SMSTransaction } from '@/app/lib/models/SMSTransaction'; 
import { SMSPackage } from '@/app/lib/models/SMSPackage';
import UserModel from '@/app/lib/models/user.model';

const paymentService = new PaymentService();

export async function POST(req: Request) {
  try {
    // Verify user session
    const session = await getServerSession(options);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request data
    const { packageId, provider, phoneNumber } = await req.json();

    // Get package details
    const smsPackage = await SMSPackage.findById(packageId);
    if (!smsPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // Create transaction record
    const user = await UserModel.findOne({ email: session.user.email });
    const transaction = await SMSTransaction.create({
      user: user._id,
      type: 'purchase',
      amount: smsPackage.price,
      credits: smsPackage.credits,
      status: 'pending',
      paymentMethod: provider,
      description: `Achat de ${smsPackage.credits} crédits SMS`,
    });

    // Initiate payment based on provider
    const paymentRequest = {
      amount: smsPackage.price,
      phoneNumber,
      description: `Achat de ${smsPackage.credits} crédits SMS`,
      provider: provider as 'orange' | 'wave',
    };

    const paymentResponse = provider === 'orange'
      ? await paymentService.initiateOrangeMoneyPayment(paymentRequest)
      : await paymentService.initiateWavePayment(paymentRequest);

    if (!paymentResponse.success) {
      await transaction.updateOne({ status: 'failed' });
      return NextResponse.json({ error: paymentResponse.error }, { status: 400 });
    }

    // Update transaction with payment ID
    await transaction.updateOne({
      paymentId: paymentResponse.transactionId,
    });

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResponse.paymentUrl,
      transactionId: transaction._id,
    });

  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

// Callback handler for Orange Money
export async function handleOrangeCallback(req: Request) {
  try {
    const data = await req.json();
    const transaction = await SMSTransaction.findOne({
      paymentId: data.pay_token,
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (data.status === 'SUCCESSFUL') {
      // Update transaction status
      await transaction.updateOne({ status: 'completed' });

      // Add credits to user account
      await UserModel.findByIdAndUpdate(transaction.user, {
        $inc: { smsCredits: transaction.credits },
      });

      return NextResponse.json({ success: true });
    } else {
      await transaction.updateOne({ status: 'failed' });
      return NextResponse.json({ success: false });
    }

  } catch (error) {
    console.error('Orange callback error:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
}

// Callback handler for Wave
export async function handleWaveCallback(req: Request) {
  try {
    const data = await req.json();
    const transaction = await SMSTransaction.findOne({
      paymentId: data.wave_transaction_id,
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (data.status === 'COMPLETED') {
      // Update transaction status
      await transaction.updateOne({ status: 'completed' });

      // Add credits to user account
      await UserModel.findByIdAndUpdate(transaction.user, {
        $inc: { smsCredits: transaction.credits },
      });

      return NextResponse.json({ success: true });
    } else {
      await transaction.updateOne({ status: 'failed' });
      return NextResponse.json({ success: false });
    }

  } catch (error) {
    console.error('Wave callback error:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
} 