// The GIT repository for this pipeline lib is defined in the global Jenkins setting
@Library('jenkins-pipeline-library')
import com.gentics.*

// Make the helpers aware of this jobs environment
JobContext.set(this)

final def sshAgent                 = '601b6ce9-37f7-439a-ac0b-8e368947d98d'
final def mattermostChannel        = "#jenkins"


GenericHelper.setParameterDefinitions([
	new ChoiceParameterDefinition('release', ['no', 'major', 'minor', 'patch', 'custom'] as String[], "If set to anything other than \"no\"," +
		"will perform a release build including GIT push and deploy to Artifactory"),
	new StringParameterDefinition('customVersion', null, "Optional: Define a custom version to release"),
])


String version = null

pipeline {
	agent {
		label 'dockerSlave'
	}

	stages {
		stage('Checkout') {
			steps {
				sh "rm -rf *"
				checkout scm
			}
		}

		stage('Build') {
			steps {
				script {
					// Increase the package version
					if (!params.release.equals('no')) {
						if (params.release.equals('custom')) {
							version = params.customVersion
						} else {
							version = params.release
						}

						// Increase / read the version and remove the first letter 'v'
						version = sh(script: 'npm version ' + version + ' --message "Release version %s"',
							returnStdout: true).trim().substring(1)

						currentBuild.description = 'Release ' + version
					}
				}

				sshagent([sshAgent]) {
					sh 'npm install'
					sh 'npm run build'
				}
			}
		}

		stage('Release') {
			when {
				expression {
					return !''.equals(params.release) && !params.release.equals('no')
				}
			}

			steps {
				echo 'Releasing version ' + version
				withCredentials([string(credentialsId: 'npm-token', variable: 'NPM_TOKEN')]) {
					sh 'npm config set //registry.npmjs.org/:_authToken ' + env.NPM_TOKEN 
					sh 'npm publish'
				}
				
				// GIT push
				sshagent([sshAgent]) {
					sh 'git push --follow-tags origin ' + GitHelper.fetchCurrentBranchName()
				}
			}
		}
	}

	post {
		always {
			// Cleanup
			step([$class: 'WsCleanup'])

			script {
				// Notify
				MattermostHelper.sendStatusNotificationMessage(mattermostChannel)
			}
		}
	}
}
