'use strict';

const parserOpts = {
  headerPattern: /^\[(ADD|FIX|MOD|DEL|REF|BRK)\]\s*(?:(\w*):)?\s*(.*)(?:\s*(#\w+-\d+))?$/,
  headerCorrespondence: ['type', 'scope', 'subject', 'issue'],
  noteKeywords: ['BREAKING CHANGE', 'BRK'],
  revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: ['header', 'hash']
};

const writerOpts = {
  transform: (commit, context) => {
    // Map Turbo Commit types to more descriptive types with emojis
    const typeMap = {
      'ADD': '🚀 Features',
      'FIX': '🐛 Bug Fixes',
      'MOD': '🔧 Changes',
      'DEL': '🗑️ Removals',
      'REF': '♻️ Refactor',
      'BRK': '💥 Breaking Changes'
    };

    commit.type = typeMap[commit.type] || commit.type;
    
    // Add links to issues if present
    if (commit.issue) {
      commit.subject = commit.subject.replace(commit.issue, '');
      commit.references = [{
        action: 'closes',
        owner: null,
        repository: null,
        issue: commit.issue.replace('#', ''),
        raw: commit.issue,
        prefix: '#'
      }];
    }

    return commit;
  },
  groupBy: 'type',
  commitGroupsSort: 'title',
  commitsSort: ['scope', 'subject'],
  noteGroupsSort: 'title',
  mainTemplate: '{{> header}}\n\n{{#each commitGroups}}\n### {{title}}\n\n{{#each commits}}\n{{> commit root=@root}}\n{{/each}}\n{{/each}}\n\n{{> footer}}',
  headerPartial: '# {{version}}{{#if date}} ({{date}}){{/if}}',
  commitPartial: '- {{#if scope}}**{{scope}}:** {{/if}}{{subject}}{{#if issue}} ({{issue}}){{/if}}',
  footerPartial: '{{#if noteGroups}}{{#each noteGroups}}\n### {{title}}\n\n{{#each notes}}\n{{text}}\n{{/each}}\n{{/each}}{{/if}}'
};

module.exports = {
  parserOpts,
  writerOpts
};