import arg from 'arg';
import inquirer from 'inquirer';

import { createProject } from './main';

const parseArgsIntoOptions = (rawArgs) => {
  const args = arg(
    {
      '--yes': Boolean,
      '--install': Boolean,
      '-y': '--yes',
      '-i': '--install'
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    template: args._[0],
    runInstall: args['--install'] || false
  };
};

const promptForMissingOptions = async (options) => {
  const defaultTemplate = 'TypeScript';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    };
  }

  const questions = [];
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: ['TypeScript', 'JavaScript'],
      default: defaultTemplate
    });
  }
  if (!options.runInstall) {
    questions.push({
      type: 'confirm',
      name: 'runInstall',
      message: 'Would you like to install dependencies?',
      default: false
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    runInstall: options.runInstall || answers.runInstall
  };
};

export const cli = async (args) => {
  const optionsFromArgs = parseArgsIntoOptions(args);
  const optionsFromPrompts = await promptForMissingOptions(optionsFromArgs);
  await createProject(optionsFromPrompts);
};
