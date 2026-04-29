import { IAppContext } from "../context/app_context";
import { prisma } from "../dbsource";

//#region Get all apps
export const GetApps = async (): Promise<IAppContext[]> => {
  try {
    const data: IAppContext[] = await prisma.giniapp.findMany();
    return data.map(({ license_private_key, ...rest }) => rest);
  } catch (error) {
    throw error;
  }
};
//#endregion

//#region Get app by id
export const GetAppById = async (
  app_id: string,
): Promise<IAppContext | null> => {
  try {
    const data: IAppContext | null = await prisma.giniapp.findUnique({
      where: {
        app_id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
//#endregion

//#region get app by code
export const GetAppByCode = async (
  app_code: string,
): Promise<IAppContext | null> => {
  try {
    const data: IAppContext | null = await prisma.giniapp.findFirst({
      where: {
        app_code,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
//#endregion

//#region update app license
export const GenerateAppLicense = async (
  app_id: string,
  license: string,
): Promise<boolean> => {
  try {
    await prisma.giniapp.update({
      data: {
        generated_license: license,
      },
      where: {
        app_id,
      },
    });

    return true;
  } catch (error) {
    throw error;
  }
};
//#endregion

export const CreateApp = async (app_ctx: IAppContext): Promise<boolean> => {
  try {
    await prisma.giniapp.create({
      data: app_ctx,
    });
    return true;
  } catch (error) {
    throw error;
  }
};
