import * as express from "express";
import { Bank } from '../schema/bank';

const router = express.Router();

router.post('/deposit', async (req, res) => {
    try {
        const { account, amount } = req.body;

        if (!account || !amount) {
            return res.status(400).json({ code: 400, message: "Invalid request. Please provide account and amount." });
        }

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

router.post('/withdraw', async (req, res) => {
    try {
        const { account, amount } = req.body;

        if (!account || !amount) {
            return res.status(400).json({ code: 400, message: "Invalid request. Please provide account and amount." });
        }

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

export { router };
