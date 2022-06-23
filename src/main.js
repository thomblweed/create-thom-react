import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const accessAsync = promisify(fs.access);
const copyAsync = promisify(ncp);

const typescriptLowercase = 'typescript';

const copyTemplateFilesAsync = async (options) => {
  return await copyAsync(options.templateDirectory, options.targetDirectory, {
    clobber: false
  });
};

const getTemplateDirectory = (templateType) => {
  const currentFileUrl = import.meta.url;
  return path.resolve(
    new URL(currentFileUrl).pathname,
    '../../templates/',
    templateType
  );
};

export const createProject = async (options) => {
  let template = options.template.toLocaleLowerCase();
  if (template !== typescriptLowercase) {
    console.log(
      '%s wrong answer, only use TypeScript',
      chalk.magentaBright.bold('SORRY')
    );
    template = typescriptLowercase;
  }

  const projectOptions = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
    templateDirectory: getTemplateDirectory(template)
  };

  try {
    await accessAsync(projectOptions.targetDirectory, fs.constants.R_OK);
  } catch (error) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFilesAsync(projectOptions)
    },
    {
      title: 'Install dependencies',
      task: () => projectInstall(projectOptions.targetDirectory),
      skip: () =>
        !projectOptions.runInstall
          ? 'Pass --install to automatically install dependencies'
          : false
    }
  ]);
  await tasks.run();

  console.log('%s React project created', chalk.green.bold('DONE'));
  return true;
};
