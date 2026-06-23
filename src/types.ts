export interface StoryGrabContext {
  storyId: string;
  title: string;
  name: string;
  args: Record<string, unknown>;
}

export interface AddonOptions {
  enabled?: boolean;
  includeArgs?: boolean;
  includeUsage?: boolean; // reserved for v1.1, not implemented
  maxDepth?: number;
  maxStringLength?: number;
  maxArrayItems?: number;
}
