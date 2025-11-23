import { get, post } from "aws-amplify/api";

export interface ImageBlock {
  "$type": "image";
  Type: "image";
  PhotographId: string;
  Caption?: string;
}

export interface TextBlock {
  "$type": "text";
  Type: "text";
  Content: string;
}

export interface SuggestionBlock {
  "$type": "suggestion";
  Type: "suggestion";
  Prompt: string;
}

export type Block = ImageBlock | TextBlock | SuggestionBlock;

export interface Section {
  Id: string;
  Title?: string;
  Description?: string;
  Theme?: string;
  StartDate?: Date;
  EndDate?: Date;
  Blocks: Block[];
}

export interface Story {
  Id: string;
  Title: string;
  StartDate?: Date;
  EndDate?: Date;
  Journal: string;
  Sections: Section[];
  CreatedAt: Date;
}

export interface DateRange {
  Start?: Date;
  End?: Date;
}

export interface StoryAnalysis {
  DateRange: DateRange;
  Metadata: StoryAnalysisMetadata;
  Sections: StorySectionAnalysis[];
}

export interface StoryAnalysisMetadata {
  PrimaryLocations: string[];
  OverallTheme: string;
}

export interface StorySectionAnalysis {
  Title: string;
  DateRange: DateRange;
  Summary: string;
  Theme: string;
}

function storyToAppModel(apiModel: any): Story {
  return {
    ...apiModel,
    StartDate: apiModel.StartDate ? new Date(apiModel.StartDate) : undefined,
    EndDate: apiModel.EndDate ? new Date(apiModel.EndDate) : undefined,
    Sections: apiModel.Sections.map((section: any) => ({
      ...section,
      StartDate: section.StartDate ? new Date(section.StartDate) : undefined,
      EndDate: section.EndDate ? new Date(section.EndDate) : undefined,
    })),
    CreatedAt: new Date(apiModel.CreatedAt),
  } as Story;
}

function storiesToAppModels(apiModels: any[]): Story[] {
  return apiModels.map(storyToAppModel);
}

export async function loadStories(): Promise<Story[]> {
  const operation = get({ apiName: "api", path: "/stories" });
  const response = await operation.response;
  return storiesToAppModels((await response.body.json()) as any[]);
}

export async function loadStory(storyId: string): Promise<Story> {
  const operation = get({ apiName: "api", path: `/stories/${storyId}` });
  const response = await operation.response;
  return storyToAppModel((await response.body.json()) as any);
}

export async function createStory(story: {
  StoryTitle: string;
  Journal: string;
  StartDate?: Date;
  EndDate?: Date;
}): Promise<Story> {
  const operation = post({
    apiName: "api",
    path: "/stories",
    options: {
      body: story as any,
    },
  });
  const response = await operation.response;
  return storyToAppModel((await response.body.json()) as any);
}

export async function updateStory(
  storyId: string,
  story: Story
): Promise<Story> {
  const operation = post({
    apiName: "api",
    path: `/stories/${storyId}`,
    options: {
      body: story as any,
    },
  });
  const response = await operation.response;
  return storyToAppModel((await response.body.json()) as any);
}

function storyAnalysisToAppModel(apiModel: any): StoryAnalysis {
  return {
    ...apiModel,
    Sections: apiModel.Sections.map((section: any) => ({
      ...section,
      DateRange: {
        Start: section.DateRange.Start ? new Date(section.DateRange.Start) : undefined,
        End: section.DateRange.End ? new Date(section.DateRange.End) : undefined,
      },
    })),
  } as StoryAnalysis;
}

export async function analyseStory(storyId: string): Promise<StoryAnalysis> {
  const operation = post({
    apiName: "api",
    path: `/stories/${storyId}/analyse`,
    options: {},
  });
  const response = await operation.response;
  return storyAnalysisToAppModel(await response.body.json() as any);
}

function blocksToAppModels(apiModels: any[]): Block[] {
  return apiModels.map((apiModel: any) => apiModel as Block);
}

export async function analyseSection(
  storyId: string,
  sectionAnalysis: StorySectionAnalysis
): Promise<Block[]> {
  const operation = post({
    apiName: "api",
    path: `/stories/${storyId}/section`,
    options: {
      body: sectionAnalysis as any,
    },
  });
  const response = await operation.response;
  return blocksToAppModels(await response.body.json() as any);
}