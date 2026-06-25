/**
 * Notion Setup Script
 * Sets up the Notion workspace structure and pre-populates Sprint 0 tasks
 */

import { Client } from '@notionhq/client';
import 'dotenv/config';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PAGE_ID = process.env.NOTION_PAGE_ID;

async function createBacklogDatabase() {
  console.log('Creating Backlog database...');
  
  const response = await notion.databases.create({
    parent: { page_id: PAGE_ID },
    title: [{ text: { content: '🗂️ Backlog' } }],
    properties: {
      'Title': { title: {} },
      'Status': {
        select: {
          options: [
            { name: 'Backlog', color: 'gray' },
            { name: 'Sprint', color: 'blue' },
            { name: 'In Progress', color: 'yellow' },
            { name: 'Done', color: 'green' },
            { name: 'Dropped', color: 'red' }
          ]
        }
      },
      'Sprint': {
        select: {
          options: [
            { name: 'Sprint 0', color: 'default' },
            { name: 'Sprint 1', color: 'default' },
            { name: 'Sprint 2', color: 'default' },
            { name: 'Sprint 3', color: 'default' },
            { name: 'Sprint 4', color: 'default' },
            { name: 'Sprint 5', color: 'default' }
          ]
        }
      },
      'Epic': {
        select: {
          options: [
            { name: 'Setup', color: 'purple' },
            { name: 'Auth', color: 'blue' },
            { name: 'Spots', color: 'green' },
            { name: 'Photos & Reviews', color: 'orange' },
            { name: 'Analytics', color: 'pink' },
            { name: 'Gamification', color: 'yellow' },
            { name: 'Training Plans', color: 'red' },
            { name: 'PWA & Launch', color: 'brown' }
          ]
        }
      },
      'Priority': {
        select: {
          options: [
            { name: 'Must', color: 'red' },
            { name: 'Should', color: 'yellow' },
            { name: 'Could', color: 'gray' }
          ]
        }
      },
      'Size': {
        select: {
          options: [
            { name: 'S', color: 'green' },
            { name: 'M', color: 'yellow' },
            { name: 'L', color: 'orange' },
            { name: 'XL', color: 'red' }
          ]
        }
      },
      'Notes': { rich_text: {} }
    }
  });

  console.log('✅ Backlog database created:', response.id);
  return response.id;
}

async function addSprint0Tasks(databaseId) {
  console.log('Adding Sprint 0 tasks...');

  const tasks = [
    {
      title: 'Create Supabase project (free tier)',
      sprint: 'Sprint 0',
      epic: 'Setup',
      priority: 'Must',
      size: 'S'
    },
    {
      title: 'Create GitHub repo',
      sprint: 'Sprint 0',
      epic: 'Setup',
      priority: 'Must',
      size: 'S'
    },
    {
      title: 'Initialize SvelteKit project with Tailwind',
      sprint: 'Sprint 0',
      epic: 'Setup',
      priority: 'Must',
      size: 'M'
    },
    {
      title: 'Run DB migrations (core schema)',
      sprint: 'Sprint 0',
      epic: 'Setup',
      priority: 'Must',
      size: 'M'
    },
    {
      title: 'Connect Vercel + auto-deploy from GitHub',
      sprint: 'Sprint 0',
      epic: 'Setup',
      priority: 'Must',
      size: 'M'
    },
    {
      title: 'Point Hostinger domain to Vercel',
      sprint: 'Sprint 0',
      epic: 'Setup',
      priority: 'Must',
      size: 'S'
    },
    {
      title: 'Add PostHog analytics SDK',
      sprint: 'Sprint 0',
      epic: 'Analytics',
      priority: 'Must',
      size: 'S'
    },
    {
      title: 'Create basic layout (nav, footer, responsive)',
      sprint: 'Sprint 0',
      epic: 'Setup',
      priority: 'Must',
      size: 'M'
    },
    {
      title: 'Set up Notion workspace',
      sprint: 'Sprint 0',
      epic: 'Setup',
      priority: 'Must',
      size: 'S',
      status: 'Done'
    }
  ];

  for (const task of tasks) {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Title': {
          title: [{ text: { content: task.title } }]
        },
        'Status': {
          select: { name: task.status || 'Sprint' }
        },
        'Sprint': {
          select: { name: task.sprint }
        },
        'Epic': {
          select: { name: task.epic }
        },
        'Priority': {
          select: { name: task.priority }
        },
        'Size': {
          select: { name: task.size }
        }
      }
    });
    console.log(`  ✅ Added: ${task.title}`);
  }

  console.log('✅ All Sprint 0 tasks added');
}

async function createSupportingPages() {
  console.log('Creating supporting pages...');

  // Decisions Log
  await notion.pages.create({
    parent: { page_id: PAGE_ID },
    properties: {
      title: [{ text: { content: '📝 Decisions Log' } }]
    },
    children: [
      {
        object: 'block',
        type: 'table',
        table: {
          table_width: 3,
          has_column_header: true,
          has_row_header: false,
          children: [
            {
              type: 'table_row',
              table_row: {
                cells: [
                  [{ text: { content: 'Date' } }],
                  [{ text: { content: 'Decision' } }],
                  [{ text: { content: 'Why' } }]
                ]
              }
            }
          ]
        }
      }
    ]
  });
  console.log('  ✅ Decisions Log created');

  // Ideas Parking Lot
  await notion.pages.create({
    parent: { page_id: PAGE_ID },
    properties: {
      title: [{ text: { content: '💡 Ideas Parking Lot' } }]
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: 'Future ideas go here (not for current sprint):' } }]
        }
      }
    ]
  });
  console.log('  ✅ Ideas Parking Lot created');

  // Weekly Review
  await notion.pages.create({
    parent: { page_id: PAGE_ID },
    properties: {
      title: [{ text: { content: '📊 Weekly Review' } }]
    },
    children: [
      {
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ text: { content: 'Week of [date]' } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: 'Sprint: Sprint X' } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: 'Tasks completed: X / Y' } }]
        }
      }
    ]
  });
  console.log('  ✅ Weekly Review created');
}

async function main() {
  try {
    console.log('🚀 Setting up Notion workspace...\n');

    const databaseId = await createBacklogDatabase();
    await addSprint0Tasks(databaseId);
    await createSupportingPages();

    console.log('\n✅ Notion workspace setup complete!');
    console.log(`\nDatabase ID: ${databaseId}`);
    console.log('Save this ID if you need to reference it later.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'object_not_found') {
      console.error('\nMake sure you:');
      console.error('1. Shared the Notion page with your integration');
      console.error('2. Used the correct page ID in .env');
    }
  }
}

main();
