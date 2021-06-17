module.exports = {
  branches: [
    // https://github.com/semantic-release/semantic-release/blob/master/docs/usage/workflow-configuration.md#workflow-configuration
    { name: 'master', channel: 'latest' },
    { name: 'main', channel: 'latest' },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', {
      changelogTitle: '# Changelog'
    }],
    ['@semantic-release/git', {
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\nRelease automatically generated through continuous delivery.'
    }],
    ['@semantic-release/github', {
      releasedLabels: [
        'released on ${nextRelease.gitTag}'
      ],
    }]
  ]
}
