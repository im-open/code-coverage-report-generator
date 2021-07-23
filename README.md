# ReportGenerator

This action is based on [danielpalme/ReportGenerator-GitHub-Action].

[ReportGenerator] converts coverage reports generated by OpenCover, dotCover, Visual Studio, NCover, Cobertura, JaCoCo, Clover, gcov or lcov into human readable reports in various formats.  

This action does not generate the code coverage reports itself, those must be created by a previous action.

## Inputs
| Parameter         | Is Required | Default Value                                 | Description                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | ----------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `reports`         | false       | */**/coverage.opencover.xml                   | The coverage reports that should be parsed (separated by semicolon). Globbing is supported.                                                                                                                                                                                                                                                      |
| `targetdir`       | false       | coverage-results                              | The directory where the generated report should be saved.                                                                                                                                                                                                                                                                                        |
| `reporttypes`     | false       | Html;MarkdownSummary;                         | The output formats and scope (separated by semicolon)<br/>Values: Badges, Clover, Cobertura, CsvSummary, Html, HtmlChart, HtmlInline, HtmlInline_AzurePipelines, HtmlInline_AzurePipelines_Dark, HtmlSummary, JsonSummary, Latex, LatexSummary, lcov, MarkdownSummary, MHtml, PngChart, SonarQube, TeamCitySummary, TextSummary, Xml, XmlSummary |
| `sourcedirs`      | false       | ''                                            | Optional directories which contain the corresponding source code (separated by semicolon). The source directories are used if coverage report contains classes without path information.                                                                                                                                                         |
| `historydir`      | false       | ''                                            | Optional directory for storing persistent coverage information. Can be used in future reports to show coverage evolution.                                                                                                                                                                                                                        |
| `plugins`         | false       | ''                                            | Optional plugin files for custom reports or custom history storage (separated by semicolon).                                                                                                                                                                                                                                                     |
| `assemblyfilters` | false       | +*                                            | Optional list of assemblies that should be included or excluded in the report. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.                                                                                                                                                                                  |
| `classfilters`    | false       | +*                                            | Optional list of classes that should be included or excluded in the report. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.                                                                                                                                                                                     |
| `filefilters`     | false       | +*                                            | Optional list of files that should be included or excluded in the report. Exclusion filters take precedence over inclusion filters. Wildcards are allowed.                                                                                                                                                                                       |
| `verbosity`       | false       | Info                                          | The verbosity level of the log messages. <br/>Values: Verbose, Info, Warning, Error, Off                                                                                                                                                                                                                                                         |
| `title`           | false       | ''                                            | Optional title.                                                                                                                                                                                                                                                                                                                                  |
| `tag`             | false       | ${{ github.run_number }}_${{ github.run_id }} | Optional tag or build version.                                                                                                                                                                                                                                                                                                                   |
| `customSettings`  | false       | ''                                            | Optional custom settings (separated by semicolon). See [Settings].                                                                                                                                                                                                                                                                               |
| `toolpath`        | false       | reportgeneratortool                           | Default directory for installing the dotnet tool.                                                                                                                                                                                                                                                                                                |

## Usage

```yml
- name: Setup .NET Core         # Required to execute ReportGenerator
  uses: actions/setup-dotnet@v1
  with:
    dotnet-version: 5.0.301

- name: dotnet test with coverage
  continue-on-error: true
  run: dotnet test ${{ env.SOLUTION }} --no-restore --logger trx --configuration Release /property:CollectCoverage=True /property:CoverletOutputFormat=opencover

- name: ReportGenerator
  uses: im-open/code-coverage-report-generator@4.8.12
  with:
    reports: '*/**/coverage.opencover.xml'
    targetdir: ${{ env.CODE_COVERAGE_DIR }}'
    reporttypes: 'Html;MarkdownSummary'
    sourcedirs: ''
    historydir: ''
    plugins: ''
    assemblyfilters: '-xunit*;-Dapper;'
    classfilters: '+*'
    filefilters: '-Startup.cs;-Program.cs;-*.cshtml'
    verbosity: 'Warning'
    title: ${{ env.CODE_COVERAGE_REPORT_NAME }}
    tag: '${{ github.workflow}}_${{ github.run_id }}'
    customSettings: ''
    toolpath: 'reportgeneratortool'

- name: Upload coverage report artifact
  uses: actions/upload-artifact@v2.2.3
  with:
    name: Coverage Report
    path: ${{ env.CODE_COVERAGE_DIR }}

- name: Create a PR comment from the summary file
  uses: im-open/process-code-coverage-summary@v1.0.0
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    summary-file: '${{ env.CODE_COVERAGE_DIR }}/Summary.md'
    create-pr-comment: true
    create-status-check: false
```

## Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```sh
# Installs dependencies and bundles the code
npm run build
```

These commands utilize [ncc](https://github.com/vercel/ncc) to bundle the action and its dependencies into a single file located in the `dist` folder.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).

[danielpalme/ReportGenerator-GitHub-Action]: https://github.com/danielpalme/ReportGenerator-GitHub-Action
[ReportGenerator]: https://github.com/danielpalme/ReportGenerator
[Settings]: https://github.com/danielpalme/ReportGenerator/wiki/Settings