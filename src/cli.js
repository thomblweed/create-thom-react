import arg from 'arg';
import inquirer from 'inquirer';

const parseArgsIntoOptions = (rawArgs) => {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install'
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
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
  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Would you like to initialize a git repository?',
      default: false
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git
  };
};

export const cli = async (args) => {
  let options = parseArgsIntoOptions(args);
  options = await promptForMissingOptions(options);
  console.log('options', options);
};