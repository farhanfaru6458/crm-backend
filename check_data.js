import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Company from './src/models/Company.js';

dotenv.config({ path: 'c:/workspace-1/main project/crm-live-project-batch-5-backend-c/.env' });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const company = await Company.findOne({ name: 'Atlas Infra' });
        console.log('Atlas Infra:', JSON.stringify(company, null, 2));
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

check();
