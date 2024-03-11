import * as express from "express";
import { Bank } from '../schema/bank';
import { sessionAuth, CustomSession } from '../function/auth';

const router = express.Router();

router.post('/deposit', sessionAuth, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ code: 400, message: "Invalid request. Please provide amount." });
        }

        if (!req.session) {
            throw new Error("Session is not available");
        }

        let customSession = req.session as CustomSession;

        const account = customSession.accountID;

        const updatedBank = await Bank.findOneAndUpdate(
            { account },
            { $inc: { balance: amount } },
            { new: true, upsert: true }
        );

        return res.status(200).json({ code: 200, message: "Deposit successful", updatedBank });
    } catch (error) {
        console.error('Error handling deposit:', error);
        return res.status(500).json({ code: 500, message: "Internal server error" });
    }
});

router.post('/withdraw', sessionAuth, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ code: 400, message: "Invalid request. Please provide amount." });
        }

        if (!req.session) {
            throw new Error("Session is not available");
        }

        let customSession = req.session as CustomSession;

        const account = customSession.accountID;

        const updatedBank = await Bank.findOneAndUpdate(
            { account, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { new: true }
        );

        if (!updatedBank) {
            return res.status(400).json({ code: 400, message: "Insufficient balance" });
        }

        return res.status(200).json({ code: 200, message: "Withdrawal successful", updatedBank });
    } catch (error) {
        console.error('Error handling withdrawal:', error);
        return res.status(500).json({ code: 500, message: "Internal server error" });
    }
});

router.get('/balance', sessionAuth, async (req, res) => {
    try {
        if (!req.session) {
            throw new Error("Session is not available");
        }

        let customSession = req.session as CustomSession;

        const account = customSession.accountID;

        const bank = await Bank.findOne({ account });

        if (!bank) {
            return res.status(400).json({ code: 400, message: "Account not found" });
        }

        return res.status(200).json({ code: 200, balance: bank.balance });
    } catch (error) {
        console.error('Error handling balance:', error);
        return res.status(500).json({ code: 500, message: "Internal server error" });
    }
});

export { router };
