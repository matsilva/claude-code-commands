/**
 * Utility functions for JSON file operations in Claude Local Command System
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { 
  ProblemDefinition, 
  TechnicalApproach, 
  TaskBreakdown,
  validateProblemDefinition,
  validateTechnicalApproach,
  validateTaskBreakdown,
  createProblemTemplate,
  createTechnicalTemplate,
  createTaskTemplate
} from './schemas';

// Constants
export const CODELOOPS_DIR = '.codeloops';
export const PROBLEM_FILE = 'problem.json';
export const TECHNICAL_FILE = 'technical.json';
export const TASKS_FILE = 'tasks.json';

// Helper functions
export const getProjectPath = (featureName: string): string => {
  return join(process.cwd(), CODELOOPS_DIR, featureName);
};

export const getProblemPath = (featureName: string): string => {
  return join(getProjectPath(featureName), PROBLEM_FILE);
};

export const getTechnicalPath = (featureName: string): string => {
  return join(getProjectPath(featureName), TECHNICAL_FILE);
};

export const getTasksPath = (featureName: string): string => {
  return join(getProjectPath(featureName), TASKS_FILE);
};

// Ensure directory exists
export const ensureProjectDir = async (featureName: string): Promise<void> => {
  const projectPath = getProjectPath(featureName);
  try {
    await fs.access(projectPath);
  } catch {
    await fs.mkdir(projectPath, { recursive: true });
  }
};

// Generic JSON file operations
export const readJsonFile = async <T>(filePath: string): Promise<T | null> => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null; // File doesn't exist
    }
    throw error;
  }
};

export const writeJsonFile = async <T>(filePath: string, data: T): Promise<void> => {
  // Ensure directory exists
  await fs.mkdir(dirname(filePath), { recursive: true });
  
  // Write with pretty formatting
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content, 'utf-8');
};

// Problem definition operations
export const readProblemDefinition = async (featureName: string): Promise<ProblemDefinition | null> => {
  const filePath = getProblemPath(featureName);
  const data = await readJsonFile<ProblemDefinition>(filePath);
  
  if (data && !validateProblemDefinition(data)) {
    throw new Error(`Invalid problem definition format in ${filePath}`);
  }
  
  return data;
};

export const writeProblemDefinition = async (featureName: string, problem: ProblemDefinition): Promise<void> => {
  if (!validateProblemDefinition(problem)) {
    throw new Error('Invalid problem definition format');
  }
  
  // Update metadata
  problem.metadata.updated = new Date().toISOString();
  problem.metadata.featureName = featureName;
  
  const filePath = getProblemPath(featureName);
  await writeJsonFile(filePath, problem);
};

export const createOrUpdateProblemDefinition = async (
  featureName: string, 
  updates: Partial<ProblemDefinition>
): Promise<ProblemDefinition> => {
  await ensureProjectDir(featureName);
  
  let existing = await readProblemDefinition(featureName);
  if (!existing) {
    existing = createProblemTemplate(featureName);
  }
  
  // Merge updates
  const updated = { ...existing, ...updates };
  await writeProblemDefinition(featureName, updated);
  
  return updated;
};

// Technical approach operations
export const readTechnicalApproach = async (featureName: string): Promise<TechnicalApproach | null> => {
  const filePath = getTechnicalPath(featureName);
  const data = await readJsonFile<TechnicalApproach>(filePath);
  
  if (data && !validateTechnicalApproach(data)) {
    throw new Error(`Invalid technical approach format in ${filePath}`);
  }
  
  return data;
};

export const writeTechnicalApproach = async (featureName: string, technical: TechnicalApproach): Promise<void> => {
  if (!validateTechnicalApproach(technical)) {
    throw new Error('Invalid technical approach format');
  }
  
  // Update metadata
  technical.metadata.updated = new Date().toISOString();
  technical.metadata.featureName = featureName;
  
  const filePath = getTechnicalPath(featureName);
  await writeJsonFile(filePath, technical);
};

export const createOrUpdateTechnicalApproach = async (
  featureName: string, 
  updates: Partial<TechnicalApproach>
): Promise<TechnicalApproach> => {
  await ensureProjectDir(featureName);
  
  let existing = await readTechnicalApproach(featureName);
  if (!existing) {
    existing = createTechnicalTemplate(featureName);
  }
  
  // Merge updates
  const updated = { ...existing, ...updates };
  await writeTechnicalApproach(featureName, updated);
  
  return updated;
};

// Task breakdown operations
export const readTaskBreakdown = async (featureName: string): Promise<TaskBreakdown | null> => {
  const filePath = getTasksPath(featureName);
  const data = await readJsonFile<TaskBreakdown>(filePath);
  
  if (data && !validateTaskBreakdown(data)) {
    throw new Error(`Invalid task breakdown format in ${filePath}`);
  }
  
  return data;
};

export const writeTaskBreakdown = async (featureName: string, tasks: TaskBreakdown): Promise<void> => {
  if (!validateTaskBreakdown(tasks)) {
    throw new Error('Invalid task breakdown format');
  }
  
  // Update metadata
  tasks.metadata.updated = new Date().toISOString();
  tasks.metadata.featureName = featureName;
  
  const filePath = getTasksPath(featureName);
  await writeJsonFile(filePath, tasks);
};

export const createOrUpdateTaskBreakdown = async (
  featureName: string, 
  updates: Partial<TaskBreakdown>
): Promise<TaskBreakdown> => {
  await ensureProjectDir(featureName);
  
  let existing = await readTaskBreakdown(featureName);
  if (!existing) {
    existing = createTaskTemplate(featureName);
  }
  
  // Merge updates
  const updated = { ...existing, ...updates };
  await writeTaskBreakdown(featureName, updated);
  
  return updated;
};

// Project management operations
export const listProjects = async (): Promise<string[]> => {
  const codeloopsPath = join(process.cwd(), CODELOOPS_DIR);
  
  try {
    const entries = await fs.readdir(codeloopsPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []; // .codeloops directory doesn't exist
    }
    throw error;
  }
};

export const projectExists = async (featureName: string): Promise<boolean> => {
  try {
    const projectPath = getProjectPath(featureName);
    await fs.access(projectPath);
    return true;
  } catch {
    return false;
  }
};

export const getProjectFiles = async (featureName: string): Promise<{
  problem: boolean;
  technical: boolean;
  tasks: boolean;
}> => {
  const exists = await projectExists(featureName);
  if (!exists) {
    return { problem: false, technical: false, tasks: false };
  }
  
  const [problemExists, technicalExists, tasksExists] = await Promise.all([
    fs.access(getProblemPath(featureName)).then(() => true).catch(() => false),
    fs.access(getTechnicalPath(featureName)).then(() => true).catch(() => false),
    fs.access(getTasksPath(featureName)).then(() => true).catch(() => false),
  ]);
  
  return {
    problem: problemExists,
    technical: technicalExists,
    tasks: tasksExists,
  };
};

// Backup and versioning
export const backupProject = async (featureName: string): Promise<string> => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `${featureName}-backup-${timestamp}`;
  const sourcePath = getProjectPath(featureName);
  const backupPath = getProjectPath(backupName);
  
  // Create backup directory
  await fs.mkdir(backupPath, { recursive: true });
  
  // Copy all files
  const files = await fs.readdir(sourcePath);
  for (const file of files) {
    const sourceFile = join(sourcePath, file);
    const backupFile = join(backupPath, file);
    await fs.copyFile(sourceFile, backupFile);
  }
  
  return backupName;
};

// Display helpers for command output
export const formatProblemSummary = (problem: ProblemDefinition): string => {
  return `📋 Problem: ${problem.problemStatement}
👥 Users: ${problem.users.length} personas defined
✅ Success Criteria: ${problem.successCriteria.length} items
🚫 Constraints: ${problem.constraints.scope || 'Not defined'}`;
};

export const formatTechnicalSummary = (technical: TechnicalApproach): string => {
  return `🏗️ Tech Stack: ${technical.technologyStack.language}/${technical.technologyStack.framework}
📊 Data Models: ${technical.dataModels.length} defined
🔌 API Endpoints: ${technical.architecture.apiEndpoints.length} planned
🔐 Security: ${technical.security.authentication || 'Not defined'}`;
};

export const formatTasksSummary = (tasks: TaskBreakdown): string => {
  const p0 = tasks.tasks.filter(t => t.priority === 'P0').length;
  const p1 = tasks.tasks.filter(t => t.priority === 'P1').length;
  const p2 = tasks.tasks.filter(t => t.priority === 'P2').length;
  const completed = tasks.tasks.filter(t => t.status === 'completed').length;
  
  return `📝 Tasks: ${tasks.tasks.length} total (${completed} completed)
🔥 P0: ${p0} | 📋 P1: ${p1} | 💡 P2: ${p2}
🔄 Dependencies: ${tasks.dependencies.length} defined`;
};