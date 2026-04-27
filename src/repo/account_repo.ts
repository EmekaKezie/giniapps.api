import { IAccountContext } from "../context/account_context";
import { ICompanyContext } from "../context/company_context";
import { prisma } from "../dbsource";



//#region: Get account by user id
export const GetAccountByUserId = async (
  user_id: string,
): Promise<IAccountContext[]> => {
  try {
    const data: IAccountContext[] = await prisma.ginivo_account.findMany({
      where: {
        user_id,
      },
      include: {
        company: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
//#endregion
