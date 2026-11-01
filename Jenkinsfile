// Jenkinsfile.windows
// Declarative Jenkins pipeline for Windows build agents


/*
Pipeline Stages:
1. Checkout: Checks out the source code from the repository.
2. Install Dependencies: Installs project dependencies using npm ci.
3. Install Playwright Browsers & Dependencies: Installs Playwright browsers and copies the .env.example file to .env if it doesn't exist.
4. Validate Android Appium: Checks Android setup before running native mobile tests.
5. Run Playwright Tests: Executes the selected Playwright test suite with the specified browser and mode (headless or headed).
6. Post Actions: Archives test reports, publishes JUnit and Allure reports, and cleans up allure-results on success.
7. Email Notification: Sends an email notification with the build status and links to the reports.
8. Parameters: Allows users to select the test suite, browser, and mode for the test execution.

*/

pipeline {
  agent any
  tools {
     // Option A: Match your exact Jenkins tool name
        git 'MyGIT' 
        
        
  }
  options { timestamps() }
  parameters {
    choice(
      name: 'TEST_SUITE',
      choices: [
        'test', 'test:e2e', 'test:master', 'test:sanity', 'test:regression',
        'test:api', 'test:web', 'test:datadriven', 'test:mobile',
        'test:mobile:appium', 'test:mobile:web'
      ],
      description: 'Select the test suite to run'
    )
    choice(
      name: 'BROWSER',
      choices: ['chromium', 'firefox', 'webkit'],
      description: 'Select the browser for tests'
    )
    choice(
      name: 'MODE',
      choices: ['headless', 'headed'],
      description: 'Run tests in headless or headed mode'
    )
  }
  environment {
    NODE_ENV = 'test'
    CI = '1'
  }
  stages {
    stage('🔄 Checkout') {
      steps {
        checkout scm
      }
    }
    stage('📦 Install Dependencies') {
      steps {
         powershell 'npm ci'
      }
    }
    stage('🤖 Install Playwright Browsers & Dependencies') {
      steps {
        powershell 'npx playwright install --with-deps'
        powershell 'if (-not (Test-Path .env)) { Copy-Item .env.example .env }'
      }
    }

    stage('📱 Validate Android Appium') {
      when {
        expression { params.TEST_SUITE in ['test:mobile', 'test:mobile:appium'] }
      }
      steps {
        powershell '''
          if (-not $env:ANDROID_APP_PATH) {
            throw 'Set ANDROID_APP_PATH in the Jenkins agent environment to the absolute APK path.'
          }
          if (-not (Test-Path -LiteralPath $env:ANDROID_APP_PATH -PathType Leaf)) {
            throw "APK not found at ANDROID_APP_PATH: $env:ANDROID_APP_PATH"
          }

          if (-not (Get-Command adb -ErrorAction SilentlyContinue)) {
            throw 'ADB was not found on PATH. Install Android platform-tools and configure PATH on this Jenkins agent.'
          }
          $devices = adb devices | Select-Object -Skip 1 | Where-Object { $_ -match '^\\S+\\s+device(\\s|$)' }
          if (-not $devices) {
            throw 'No online Android device/emulator found. Start an emulator or connect a device to this Jenkins agent.'
          }

          try {
            Invoke-RestMethod -Uri 'http://127.0.0.1:4723/status' -TimeoutSec 5 | Out-Null
          } catch {
            throw 'Appium is not responding at http://127.0.0.1:4723/. Start the Appium server on this Jenkins agent.'
          }
        '''
      }
    }

    stage('▶️ Run Playwright Tests') {
      steps {
        script {
          def suite = params.TEST_SUITE
          def modeFlag = params.MODE == 'headed' ? '--headed' : ''
          if (suite in ['test:mobile', 'test:mobile:appium']) {
            powershell "npm run ${suite}"
          } else if (suite == 'test:mobile:web') {
            powershell "npm run ${suite} -- ${modeFlag}"
          } else {
            def browserFlag = "--project=${params.BROWSER}"
            powershell "npm run ${suite} -- ${browserFlag} ${modeFlag}"
          }
        }
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'reports/**,custom-report/**,allure-results/**', allowEmptyArchive: true
      junit testResults: 'reports/results.xml', allowEmptyResults: true
      allure includeProperties: false, results: [[path: 'allure-results']]
      publishHTML([
        allowMissing: true,
        alwaysLinkToLastBuild: true,
        keepAll: true,
        reportDir: 'reports',
        reportFiles: 'index.html',
        reportName: 'Playwright HTML Report'
      ])
      publishHTML([
        allowMissing: true,
        alwaysLinkToLastBuild: true,
        keepAll: true,
        reportDir: 'custom-report',
        reportFiles: '*.html',
        reportName: 'Custom Test Report'
      ])
      emailext(
        subject: "Jenkins Build: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
        body: """
            <h2>Playwright Test Execution Report</h2>
            <p><b>Job:</b> ${env.JOB_NAME}</p>
            <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
            <p><b>Status:</b> ${currentBuild.currentResult}</p>
            <p><b>Test Suite:</b> ${params.TEST_SUITE}</p>
            <p><b>Browser:</b> ${params.BROWSER}</p>
            <p>
              <a href="${env.BUILD_URL}">Open Jenkins Build</a> |
              <a href="${env.BUILD_URL}Playwright_20HTML_20Report">Open Playwright HTML Report</a> |
              <a href="${env.BUILD_URL}Custom_20Test_20Report">Open Custom Report</a>
            </p>
        """,
        to: "RECIVER_EMAIL_ADDRESS", //Replace with the recipient's email address
        from: "SENDER_EMAIL_ADDRESS", //Replace with the sender's email address
        replyTo: "RECIVER_EMAIL_ADDRESS",  //Replace with the recipient's email address
        mimeType: "text/html" //Defines the format of the email body. text/html allows HTML formatting (tables, colors, bold text, links, etc.).
      )
    }
    success {
      script {
        powershell 'Remove-Item -Recurse -Force allure-results'
      }
    }
  }
}
