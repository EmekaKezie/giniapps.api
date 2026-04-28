import { IAccountContext } from "../context/account_context";
import { ICompanyContext } from "../context/company_context";
import { prisma } from "../dbsource";

//#region: Get account by user id
export const GetAccountByUserId = async (
  user_id: string,
): Promise<IAccountContext | null> => {
  try {
    const data: IAccountContext | null = await prisma.giniapp_account.findFirst(
      {
        where: {
          user_id,
        },
      },
    );
    return data;
  } catch (error) {
    throw error;
  }
};
//#endregion
