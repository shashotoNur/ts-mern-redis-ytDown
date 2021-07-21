const { connect } = require('mongoose');

const connectToDatabase = async () =>
  {
    try
    {
      console.log('Initiating database connection...')
      const connectionResponse = await connect(process.env.MONGO_URI,
        {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex:true,
          useFindAndModify: false
        });

      console.log(`Connected to MongoDB Atlas: ${connectionResponse.connection.host}`);
    }

    catch (err)
    {
      console.error(err);
      process.exit(1);
    };
  };

export default connectToDatabase;