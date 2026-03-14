import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lead from './src/models/Lead.js';

dotenv.config({ path: 'c:/workspace-1/main project/crm-live-project-batch-5-backend-c/.env' });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const lead = await Lead.findOne({ company: /Atlas/i });
        console.log('Lead for Atlas:', JSON.stringify(lead, null, 2));
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

check();
