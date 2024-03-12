module.exports = async (core, fs, fullStringFile, substringFile) => {
  core.info('Asserting that the file contains the expected substring');

  core.info(`Asserting full file contains substring:`);

  const fullString = fs.readFileSync(fullStringFile, 'utf8');
  core.startGroup(`Full file contents from '${fullStringFile}'`);
  core.info(`'${fullString}'`);
  core.endGroup();

  const substring = fs.readFileSync(substringFile, 'utf8');
  core.startGroup(`Substring from '${substringFile}'`);
  core.info(`'${substring}'`);
  core.endGroup();

  if (fullString.includes(substring.trim())) {
    core.info('The file contains the substring, which is expected.');
  } else {
    core.setFailed('The file does not contain the substring, which is not expected.');
  }
};
