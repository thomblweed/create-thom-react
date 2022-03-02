import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);

const copyTemplateFiles = async (options) => {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false
  });
};

const getTemplateDirectory = () => {
  const currentFileUrl = import.meta.url;
  return path.resolve(new URL(currentFileUrl).pathname, '../../templates/');
};

export const createProject = async (options) => {
  const projectOptions = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
    templateDirectory: getTemplateDirectory()
  };

  try {
    await access(projectOptions.targetDirectory, fs.constants.R_OK);
  } catch (error) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  console.log('Copy project files');
  await copyTemplateFiles(projectOptions);

  console.log('%s Project created', chalk.green.bold('DONE'));
  return true;
};
