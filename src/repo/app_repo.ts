import { IAppContext } from "../context/app_context";
import { prisma } from "../dbsource";

export const GetApps = async (): Promise<IAppContext[]> => {
  try {
    const data: IAppContext[] = await prisma.gini_app.findMany();
    return data.map(({ license_private_key, ...rest }) => rest);
  } catch (error) {
    throw error;
  }
};

export const GetAppById = async (
  app_id: string,
): Promise<IAppContext | null> => {
  try {
    const data: IAppContext | null = await prisma.gini_app.findUnique({
      where: {
        app_id,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GetAppByCode = async (
  app_code: string,
): Promise<IAppContext | null> => {
  try {
    const data: IAppContext | null = await prisma.gini_app.findFirst({
      where: {
        app_code,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const GenerateAppLicense = async (
  app_id: string,
  license: string,
): Promise<boolean> => {
  try {
    await prisma.gini_app.update({
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
