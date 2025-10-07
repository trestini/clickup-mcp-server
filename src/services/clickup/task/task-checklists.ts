/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * Task Checklist Service
 *
 * Handles checklist operations for tasks in ClickUp.
 * This service provides methods for creating, updating, and managing checklists and checklist items.
 */

import { TaskServiceCore } from "./task-core.js";
import {
  ClickUpChecklist,
  ClickUpChecklistItem,
  CreateChecklistData,
  CreateChecklistItemData,
  UpdateChecklistItemData,
} from "../types.js";

/**
 * Service for managing task checklists
 */
export class TaskServiceChecklists {
  constructor(private core: TaskServiceCore) {}

  /**
   * Create a new checklist for a task
   * @param taskId - The ID of the task to add the checklist to
   * @param data - Checklist creation data
   * @returns The created checklist
   */
  async createChecklist(
    taskId: string,
    data: CreateChecklistData,
  ): Promise<ClickUpChecklist> {
    (this.core as any).logOperation("createChecklist", {
      taskId,
      name: data.name,
    });

    try {
      const response = await (this.core as any).makeRequest(async () => {
        const result = await (this.core as any).client.post(
          `/task/${taskId}/checklist`,
          data,
        );
        return result.data;
      });

      (this.core as any).logOperation("createChecklist:success", {
        taskId,
        checklistId: response.checklist.id,
        name: response.checklist.name,
      });

      return response.checklist;
    } catch (error) {
      (this.core as any).logOperation("createChecklist:error", {
        taskId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Create a new checklist item
   * @param checklistId - The ID of the checklist to add the item to
   * @param data - Checklist item creation data
   * @returns The created checklist item
   */
  async createChecklistItem(
    checklistId: string,
    data: CreateChecklistItemData,
  ): Promise<ClickUpChecklistItem> {
    (this.core as any).logOperation("createChecklistItem", {
      checklistId,
      name: data.name,
    });

    try {
      const response = await (this.core as any).makeRequest(async () => {
        const result = await (this.core as any).client.post(
          `/checklist/${checklistId}/checklist_item`,
          data,
        );
        return result.data;
      });

      const insertedItem = response.checklist.items.at(-1);

      (this.core as any).logOperation("createChecklistItem:success", {
        checklistId,
        itemId: insertedItem.id,
        name: insertedItem.name,
      });

      return insertedItem;
    } catch (error) {
      (this.core as any).logOperation("createChecklistItem:error", {
        checklistId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Update a checklist item
   * @param checklistId - The ID of the checklist containing the item
   * @param checklistItemId - The ID of the checklist item to update
   * @param data - Update data for the checklist item
   * @returns The updated checklist item
   */
  async updateChecklistItem(
    checklistId: string,
    checklistItemId: string,
    data: UpdateChecklistItemData,
  ): Promise<ClickUpChecklistItem> {
    (this.core as any).logOperation("updateChecklistItem", {
      checklistId,
      checklistItemId,
      data,
    });

    try {
      const response = await (this.core as any).makeRequest(async () => {
        const result = await (this.core as any).client.put(
          `/checklist/${checklistId}/checklist_item/${checklistItemId}`,
          data,
        );
        return result.data;
      });

      const updatedItem = response.checklist.items.find(
        (item: ClickUpChecklistItem) => item.id === checklistItemId
      );

      if (!updatedItem) {
        throw new Error(`Updated checklist item ${checklistItemId} not found in response`);
      }

      (this.core as any).logOperation("updateChecklistItem:success", {
        checklistId,
        checklistItemId,
        itemId: updatedItem.id,
        name: updatedItem.name,
        resolved: updatedItem.resolved,
      });

      return updatedItem;
    } catch (error) {
      (this.core as any).logOperation("updateChecklistItem:error", {
        checklistId,
        checklistItemId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Delete a checklist item
   * @param checklistId - The ID of the checklist containing the item
   * @param checklistItemId - The ID of the checklist item to delete
   * @returns Success status
   */
  async deleteChecklistItem(
    checklistId: string,
    checklistItemId: string,
  ): Promise<boolean> {
    (this.core as any).logOperation("deleteChecklistItem", {
      checklistId,
      checklistItemId,
    });

    try {
      await (this.core as any).makeRequest(async () => {
        const result = await (this.core as any).client.delete(
          `/checklist/${checklistId}/checklist_item/${checklistItemId}`,
        );
        return result.data;
      });

      (this.core as any).logOperation("deleteChecklistItem:success", {
        checklistId,
        checklistItemId,
      });
      return true;
    } catch (error) {
      (this.core as any).logOperation("deleteChecklistItem:error", {
        checklistId,
        checklistItemId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Update a checklist (rename it)
   * @param checklistId - The ID of the checklist to update
   * @param data - Update data for the checklist
   * @returns The updated checklist
   */
  async updateChecklist(
    checklistId: string,
    data: { name: string },
  ): Promise<ClickUpChecklist> {
    (this.core as any).logOperation("updateChecklist", {
      checklistId,
      name: data.name,
    });

    try {
      const response = await (this.core as any).makeRequest(async () => {
        const result = await (this.core as any).client.put(
          `/checklist/${checklistId}`,
          data,
        );
        return result.data;
      });

      (this.core as any).logOperation("updateChecklist:success", {
        checklistId,
        name: response.checklist.name,
      });

      return response.checklist;
    } catch (error) {
      (this.core as any).logOperation("updateChecklist:error", {
        checklistId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Delete a checklist
   * @param checklistId - The ID of the checklist to delete
   * @returns Success status
   */
  async deleteChecklist(checklistId: string): Promise<boolean> {
    (this.core as any).logOperation("deleteChecklist", { checklistId });

    try {
      await (this.core as any).makeRequest(async () => {
        const result = await (this.core as any).client.delete(
          `/checklist/${checklistId}`,
        );
        return result.data;
      });

      (this.core as any).logOperation("deleteChecklist:success", {
        checklistId,
      });
      return true;
    } catch (error) {
      (this.core as any).logOperation("deleteChecklist:error", {
        checklistId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get all checklists for a task
   * @param taskId - The ID of the task
   * @returns Array of checklists
   */
  async getTaskChecklists(taskId: string): Promise<ClickUpChecklist[]> {
    (this.core as any).logOperation("getTaskChecklists", { taskId });

    try {
      // Get task details which includes checklists
      const response = await (this.core as any).makeRequest(async () => {
        const result = await (this.core as any).client.get(`/task/${taskId}`, {
          params: {
            include_subtasks: false,
            include_checklists: true,
          },
        });
        return result.data;
      });

      const checklists = response.checklists || [];
      (this.core as any).logOperation("getTaskChecklists:success", {
        taskId,
        checklistCount: checklists.length,
      });

      return checklists;
    } catch (error) {
      (this.core as any).logOperation("getTaskChecklists:error", {
        taskId,
        error: error.message,
      });
      throw error;
    }
  }
}
