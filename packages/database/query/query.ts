import connectMongo from '../connectMongo';
import pitchTable from '../Tables/pitchTable';
import userTable from '../Tables/userTable';
import jwt from 'jsonwebtoken';

export const query = {
  getPitches: async () => {
    await connectMongo();
    return pitchTable.find({}).lean();
  },
  //TODO : return the types of the query according to requested dataField
  getUser: async ({ email }: { email: string }) => {
    await connectMongo();
    return userTable
      .findOne({ email }, [
        'email',
        'fullName',
        'password',
        'phone',
        'status',
      ] as const)
  },
  getUserByToken: async ({ token }: { token: string }) => {
    await connectMongo();
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET ?? 'secret');
      return userTable
        .findOne({ _id: user.id }, [
          'email',
          'fullName',
          'phone',
          'status',
        ] as const)
        .lean();
    } catch (e) {
      console.error(e);
    }
  },
};
export default query;
