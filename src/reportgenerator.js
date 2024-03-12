const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');

const reportGeneratorVersion = '5.2.2';

async function run() {
  try {
    const verbosity = core.getInput('verbosity').trim();
    if (!isVerbosityValid(verbosity)) return;

    const reportTypes = core.getInput('reporttypes').replace(/\s/g, '');
    if (!areReportTypesValid(reportTypes)) return;

    let output = '';
    const toolPath = 'reportgeneratortool';

    core.info('\nDetecting .NET Core SDK...');
    try {
      core.startGroup('dotnet version output');
      await exec.exec('dotnet', ['--version'], {
        listeners: {
          stdout: data => {
            output += data.toString();
          }
        }
      });
      core.endGroup();
      core.info(`Detected .NET Core SDK version '${output.trim()}'`);
    } catch (error) {
      core.endGroup();
      const shortMsg = 'dotnet not available';
      core.setOutput('error-reason', shortMsg);
      core.setFailed(shortMsg);
      core.info('Please install with the following command in your YAML file:');
      core.info('- name: Setup .NET Core');
      core.info('  uses: actions/setup-dotnet@v1');
      core.info('  with');
      core.info("    dotnet-version: '8.x' # 5.0 or higher");
      return;
    }

    core.info('\nChecking for ReportGenerator global tool...');
    if (fs.existsSync(toolPath)) {
      core.info('ReportGenerator global tool already installed');
    } else {
      output = '';

      try {
        core.startGroup('Installing ReportGenerator global tool');
        core.info('https://www.nuget.org/packages/dotnet-reportgenerator-globaltool');
        await exec.exec(
          'dotnet',
          [
            'tool',
            'install',
            'dotnet-reportgenerator-globaltool',
            '--tool-path',
            toolPath,
            '--version',
            reportGeneratorVersion,
            '--ignore-failed-sources'
          ],
          {
            listeners: {
              stdout: data => {
                output += data.toString();
              }
            }
          }
        );
        core.endGroup();
        core.info('Successfully installed ReportGenerator global tool');
      } catch (error) {
        core.endGroup();
        core.setFailed('Failed to install ReportGenerator global tool');
        return;
      }
    }

    core.info('\nExecuting ReportGenerator global tool');
    try {
      let args = [
        `-reports:${core.getInput('reports')}`,
        `-targetdir:${core.getInput('targetdir')}`,
        `-reporttypes:${reportTypes}`,
        `-assemblyfilters:${core.getInput('assemblyfilters')}`,
        `-classfilters:${core.getInput('classfilters')}`,
        `-filefilters:${core.getInput('filefilters')}`,
        `-verbosity:${verbosity}`,
        `-title:${core.getInput('title')}`,
        `-tag:${core.getInput('tag')}`
      ];
      core.startGroup('reportgenerator output');
      await exec.exec(`${toolPath}/reportgenerator`, args, {
        listeners: {
          stdout: data => {
            output += data.toString();
          }
        }
      });
      core.endGroup();
      core.info('Successfully executed ReportGenerator');
    } catch (error) {
      core.endGroup();
      if (output.includes('No matching files found.')) {
        const shortMsg = 'No matching files found';
        core.setOutput('error-reason', shortMsg);
        core.setFailed(`${shortMsg}. Verify reports input matches the coverage files to be processed by this action.`);
      } else {
        const shortMsg = 'Failed to execute ReportGenerator.exe';
        core.setOutput('error-reason', shortMsg);
        core.setFailed(`${shortMsg}: ${error.message}`);
      }
      return;
    }
  } catch (error) {
    const shortMsg = 'Failed to execute the action';
    core.setOutput('error-reason', shortMsg);
    core.setFailed(`${shortMsg}: ${error.message}`);
  }
}

run();

function areReportTypesValid(reportTypes) {
  const allowedValues = [
    'badges',
    'cobertura',
    'clover',
    'csvsummary',
    'html',
    'htmlchart',
    'htmlinline',
    'htmlinline_azurepipelines',
    'htmlinline_azurepipelines_dark',
    'htmlsummary',
    'jsonsummary',
    'latex',
    'latexsummary',
    'markdownsummary',
    'lcov',
    'mhtml',
    'pngchart',
    'sonarqube',
    'teamcitysummary',
    'textsummary',
    'xml',
    'xmlsummary'
  ];

  const reportTypesArray = reportTypes.split(';');
  let reportTypesAreValid = true;

  for (const reportType of reportTypesArray) {
    if (!reportType || reportType.trim().length === 0) continue;

    const valueToCheck = reportType.trim().toLowerCase();
    if (!allowedValues.includes(valueToCheck)) {
      const shortMsg = 'Invalid report type';
      core.setOutput('error-reason', shortMsg);
      core.setFailed(`${shortMsg}: ${reportType}`);
      reportTypesAreValid = false;
    }
  }
  if (!reportTypesAreValid) {
    core.info(`Allowed report type values: ${allowedValues.join(', ')}`);
  }

  return reportTypesAreValid;
}

function isVerbosityValid(verbosity) {
  const valueToCheck = verbosity ? verbosity.trim().toLowerCase() : '';
  const allowedValues = ['error', 'warning', 'info', 'verbose', 'off'];
  if (!allowedValues.includes(valueToCheck)) {
    const shortMsg = 'Invalid verbosity';
    core.setOutput('error-reason', shortMsg);
    core.setFailed(`${shortMsg}: ${verbosity}`);
    core.info(`Allowed verbosity values: ${allowedValues.join(', ')}`);
    return false;
  }

  return true;
}
