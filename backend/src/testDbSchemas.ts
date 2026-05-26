import mongoose from 'mongoose';
import { User } from './models/User';
import { Dataset } from './models/Dataset';
import { Match } from './models/Match';
import { Delivery } from './models/Delivery';
import { Analytics } from './models/Analytics';
import { Report } from './models/Report';
import { connectDatabase } from './config/dbConnect';

const testDbSchemas = () => {
  console.log('==================================================');
  console.log('  IPL InsightX MongoDB Schema Compilation Test  ');
  console.log('==================================================');

  try {
    console.log('[+] Compiling User Schema...');
    const userModelName = User.modelName;
    console.log(`    -> User model compiled: ${userModelName}`);

    console.log('[+] Compiling Dataset Schema...');
    const datasetModelName = Dataset.modelName;
    console.log(`    -> Dataset model compiled: ${datasetModelName}`);

    console.log('[+] Compiling Match Schema...');
    const matchModelName = Match.modelName;
    console.log(`    -> Match model compiled: ${matchModelName}`);

    console.log('[+] Compiling Delivery Schema...');
    const deliveryModelName = Delivery.modelName;
    console.log(`    -> Delivery model compiled: ${deliveryModelName}`);

    console.log('[+] Compiling Analytics Cache Schema...');
    const analyticsModelName = Analytics.modelName;
    console.log(`    -> Analytics model compiled: ${analyticsModelName}`);

    console.log('[+] Compiling Report Schema...');
    const reportModelName = Report.modelName;
    console.log(`    -> Report model compiled: ${reportModelName}`);

    console.log('\n[SUCCESS] All Mongoose database schemas compiled successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n[FAILURE] Schema compilation encountered error:', error);
    process.exit(1);
  }
};

testDbSchemas();
export default testDbSchemas;
