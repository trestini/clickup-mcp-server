/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp Checklist Tools
 *
 * MCP tools for managing checklists and checklist items within tasks.
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { clickUpServices } from "../../services/shared.js";
import { validateTaskIdentification, getTaskId } from "./utilities.js";

// Zod schemas for validation
const CreateChecklistSchema = z.object({
  taskId: z.string().optional(),
  taskName: z.string().optional(),
  listId: z.string().optional(),
  listName: z.string().optional(),
  name: z.string().min(1, "Checklist name is required"),
});

const CreateChecklistItemSchema = z.object({
  checklistId: z.string().min(1, "Checklist ID is required"),
  name: z.string().min(1, "Item name is required"),
  assignee: z.number().optional(),
});

const UpdateChecklistItemSchema = z.object({
  checklistId: z.string().min(1, "Checklist ID is required"),
  checklistItemId: z.string().min(1, "Checklist item ID is required"),
  name: z.string().optional(),
  resolved: z.boolean().optional(),
  assignee: z.number().optional(),
});

const UpdateChecklistSchema = z.object({
  checklistId: z.string().min(1, "Checklist ID is required"),
  name: z.string().min(1, "Checklist name is required"),
});

const DeleteChecklistSchema = z.object({
  checklistId: z.string().min(1, "Checklist ID is required"),
});

const DeleteChecklistItemSchema = z.object({
  checklistId: z.string().min(1, "Checklist ID is required"),
  checklistItemId: z.string().min(1, "Checklist item ID is required"),
});

const GetTaskChecklistsSchema = z.object({
  taskId: z.string().optional(),
  taskName: z.string().optional(),
  listId: z.string().optional(),
  listName: z.string().optional(),
});

// Tool definitions
export const createChecklistTool: Tool = {
  name: "create_checklist",
  description:
    "Create a new checklist for a specific task. Checklists help organize subtasks and track progress within a task.",
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "The ID of the task to create the checklist for",
      },
      taskName: {
        type: "string",
        description:
          "The name of the task to create the checklist for (alternative to taskId)",
      },
      listId: {
        type: "string",
        description:
          "The ID of the list containing the task (required when using taskName)",
      },
      listName: {
        type: "string",
        description:
          "The name of the list containing the task (alternative to listId when using taskName)",
      },
      name: {
        type: "string",
        description: "The name of the checklist",
      },
    },
    required: ["name"],
    additionalProperties: false,
  },
};

export const createChecklistItemTool: Tool = {
  name: "create_checklist_item",
  description:
    "Add a new item to an existing checklist. This creates individual tasks within a checklist.",
  inputSchema: {
    type: "object",
    properties: {
      checklistId: {
        type: "string",
        description: "The ID of the checklist to add the item to",
      },
      name: {
        type: "string",
        description: "The name/text of the checklist item",
      },
      assignee: {
        type: "number",
        description: "Optional user ID to assign this checklist item to",
      },
    },
    required: ["checklistId", "name"],
    additionalProperties: false,
  },
};

export const updateChecklistItemTool: Tool = {
  name: "update_checklist_item",
  description:
    "Update a checklist item. You can change its name, mark it as resolved/unresolved, or change the assignee.",
  inputSchema: {
    type: "object",
    properties: {
      checklistId: {
        type: "string",
        description: "The ID of the checklist containing the item",
      },
      checklistItemId: {
        type: "string",
        description: "The ID of the checklist item to update",
      },
      name: {
        type: "string",
        description: "New name for the checklist item",
      },
      resolved: {
        type: "boolean",
        description:
          "Whether the checklist item is completed (true) or not (false)",
      },
      assignee: {
        type: "number",
        description: "User ID to assign this checklist item to",
      },
    },
    required: ["checklistId", "checklistItemId"],
    additionalProperties: false,
  },
};

export const updateChecklistTool: Tool = {
  name: "update_checklist",
  description:
    "Update a checklist (currently only supports renaming the checklist).",
  inputSchema: {
    type: "object",
    properties: {
      checklistId: {
        type: "string",
        description: "The ID of the checklist to update",
      },
      name: {
        type: "string",
        description: "New name for the checklist",
      },
    },
    required: ["checklistId", "name"],
    additionalProperties: false,
  },
};

export const deleteChecklistTool: Tool = {
  name: "delete_checklist",
  description: "Delete an entire checklist and all its items from a task.",
  inputSchema: {
    type: "object",
    properties: {
      checklistId: {
        type: "string",
        description: "The ID of the checklist to delete",
      },
    },
    required: ["checklistId"],
    additionalProperties: false,
  },
};

export const deleteChecklistItemTool: Tool = {
  name: "delete_checklist_item",
  description: "Delete a specific item from a checklist.",
  inputSchema: {
    type: "object",
    properties: {
      checklistId: {
        type: "string",
        description: "The ID of the checklist containing the item",
      },
      checklistItemId: {
        type: "string",
        description: "The ID of the checklist item to delete",
      },
    },
    required: ["checklistId", "checklistItemId"],
    additionalProperties: false,
  },
};

export const getTaskChecklistsTool: Tool = {
  name: "get_task_checklists",
  description:
    "Get all checklists for a specific task, including all checklist items.",
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "string",
        description: "The ID of the task to get checklists for",
      },
      taskName: {
        type: "string",
        description:
          "The name of the task to get checklists for (alternative to taskId)",
      },
      listId: {
        type: "string",
        description:
          "The ID of the list containing the task (required when using taskName)",
      },
      listName: {
        type: "string",
        description:
          "The name of the list containing the task (alternative to listId when using taskName)",
      },
    },
    required: [],
    additionalProperties: false,
  },
};

// Handler functions
export async function handleCreateChecklist(args: any) {
  const parsed = CreateChecklistSchema.parse(args);

  // Validate and resolve task identification
  validateTaskIdentification(parsed);
  const resolvedTaskId = await getTaskId(
    parsed.taskId,
    parsed.taskName,
    parsed.listName,
  );

  const result = await clickUpServices.task.createChecklist(resolvedTaskId, {
    name: parsed.name,
  });

  return {
    content: [
      {
        type: "text",
        text:
          `✅ Created checklist "${result.name}" for task ${resolvedTaskId}\n\n` +
          `**Checklist Details:**\n` +
          `- ID: ${result.id}\n` +
          `- Name: ${result.name}\n` +
          `- Created: ${new Date(parseInt(result.date_created)).toLocaleString()}\n` +
          `- Items: ${result.items?.length || 0} items`,
      },
    ],
  };
}

export async function handleCreateChecklistItem(args: any) {
  const parsed = CreateChecklistItemSchema.parse(args);

  const result = await clickUpServices.task.createChecklistItem(
    parsed.checklistId,
    {
      name: parsed.name,
      assignee: parsed.assignee,
    },
  );

  return {
    content: [
      {
        type: "text",
        text:
          `📝 Added checklist item "${result.name}" to checklist ${parsed.checklistId}\n\n` +
          `**Item Details:**\n` +
          `- ID: ${result.id}\n` +
          `- Name: ${result.name}\n` +
          `- Status: ${result.resolved ? "✅ Completed" : "⏳ Pending"}\n` +
          `- Created: ${new Date(parseInt(result.date_created)).toLocaleString()}` +
          (result.assignee
            ? `\n- Assigned to: ${result.assignee.username}`
            : ""),
      },
    ],
  };
}

export async function handleUpdateChecklistItem(args: any) {
  const parsed = UpdateChecklistItemSchema.parse(args);

  const updateData: any = {};
  if (parsed.name !== undefined) updateData.name = parsed.name;
  if (parsed.resolved !== undefined) updateData.resolved = parsed.resolved;
  if (parsed.assignee !== undefined) updateData.assignee = parsed.assignee;

  const result = await clickUpServices.task.updateChecklistItem(
    parsed.checklistId,
    parsed.checklistItemId,
    updateData,
  );

  return {
    content: [
      {
        type: "text",
        text:
          `✏️ Updated checklist item "${result.name}"\n\n` +
          `**Updated Details:**\n` +
          `- ID: ${result.id}\n` +
          `- Name: ${result.name}\n` +
          `- Status: ${result.resolved ? "✅ Completed" : "⏳ Pending"}\n` +
          `- Last updated: ${new Date(parseInt(result.date_updated)).toLocaleString()}` +
          (result.assignee
            ? `\n- Assigned to: ${result.assignee.username}`
            : ""),
      },
    ],
  };
}

export async function handleUpdateChecklist(args: any) {
  const parsed = UpdateChecklistSchema.parse(args);

  const result = await clickUpServices.task.updateChecklist(
    parsed.checklistId,
    {
      name: parsed.name,
    },
  );

  return {
    content: [
      {
        type: "text",
        text:
          `✏️ Updated checklist name to "${result.name}"\n\n` +
          `**Checklist Details:**\n` +
          `- ID: ${result.id}\n` +
          `- Name: ${result.name}\n` +
          `- Items: ${result.resolved + result.unresolved} total (${result.resolved} completed, ${result.unresolved} pending)\n` +
          `- Last updated: ${new Date(parseInt(result.date_updated)).toLocaleString()}`,
      },
    ],
  };
}

export async function handleDeleteChecklist(args: any) {
  const parsed = DeleteChecklistSchema.parse(args);

  await clickUpServices.task.deleteChecklist(parsed.checklistId);

  return {
    content: [
      {
        type: "text",
        text: `🗑️ Successfully deleted checklist ${parsed.checklistId}`,
      },
    ],
  };
}

export async function handleDeleteChecklistItem(args: any) {
  const parsed = DeleteChecklistItemSchema.parse(args);

  await clickUpServices.task.deleteChecklistItem(
    parsed.checklistId,
    parsed.checklistItemId,
  );

  return {
    content: [
      {
        type: "text",
        text: `🗑️ Successfully deleted checklist item ${parsed.checklistItemId} from checklist ${parsed.checklistId}`,
      },
    ],
  };
}

export async function handleGetTaskChecklists(args: any) {
  const parsed = GetTaskChecklistsSchema.parse(args);

  // Validate and resolve task identification
  validateTaskIdentification(parsed);
  const resolvedTaskId = await getTaskId(
    parsed.taskId,
    parsed.taskName,
    parsed.listName,
  );

  const checklists =
    await clickUpServices.task.getTaskChecklists(resolvedTaskId);

  if (checklists.length === 0) {
    return {
      content: [
        {
          type: "text",
          text: `📋 No checklists found for task ${resolvedTaskId}`,
        },
      ],
    };
  }

  let output = `📋 **Checklists for task ${resolvedTaskId}**\n\n`;

  checklists.forEach((checklist, index) => {
    output += `**${index + 1}. ${checklist.name}** (ID: ${checklist.id})\n`;
    output += `   Progress: ${checklist.resolved}/${checklist.resolved + checklist.unresolved} completed\n`;

    if (checklist.items && checklist.items.length > 0) {
      checklist.items.forEach((item, itemIndex) => {
        const status = item.resolved ? "✅" : "☐";
        const assignee = item.assignee
          ? ` (assigned to ${item.assignee.username})`
          : "";
        output += `   ${status} ${itemIndex + 1}. ${item.name}${assignee}\n`;
      });
    }
    output += "\n";
  });

  return {
    content: [
      {
        type: "text",
        text: output.trim(),
      },
    ],
  };
}

// Export all tools and handlers
export const checklistTools = [
  createChecklistTool,
  createChecklistItemTool,
  updateChecklistItemTool,
  updateChecklistTool,
  deleteChecklistTool,
  deleteChecklistItemTool,
  getTaskChecklistsTool,
];

export const checklistHandlers = {
  create_checklist: handleCreateChecklist,
  create_checklist_item: handleCreateChecklistItem,
  update_checklist_item: handleUpdateChecklistItem,
  update_checklist: handleUpdateChecklist,
  delete_checklist: handleDeleteChecklist,
  delete_checklist_item: handleDeleteChecklistItem,
  get_task_checklists: handleGetTaskChecklists,
};
