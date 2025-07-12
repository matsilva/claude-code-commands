/**
 * JSON Schemas for Claude Local Command System
 * Migrated from GitHub Projects to local .codeloops/ storage
 */

export interface ProblemDefinition {
  metadata: {
    created: string;
    updated: string;
    version: string;
    featureName: string;
  };
  problemStatement: string;
  why: string;
  successCriteria: string[];
  constraints: {
    technical: string;
    business: string;
    scope: string;
    nonGoals: string;
  };
  users: UserPersona[];
}

export interface UserPersona {
  persona: string;
  goals: string[];
  painPoints: string[];
  stories: string[]; // "As a [user], I want [goal], so that [benefit]" format
}

export interface TechnicalApproach {
  metadata: {
    created: string;
    updated: string;
    version: string;
    featureName: string;
  };
  technologyStack: {
    language: string;
    framework: string;
    dependencies: string[];
    database: string;
    infrastructure: string;
  };
  dataModels: DataModel[];
  architecture: {
    components: string[];
    apiEndpoints: ApiEndpoint[];
    integrationPoints: string[];
    fileOrganization: string[];
  };
  security: {
    authentication: string;
    authorization: string;
    validation: string;
    errorHandling: string;
  };
}

export interface DataModel {
  name: string;
  schema: string; // JSON schema or TypeScript definition
  validationRules: string;
  relationships?: string[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  purpose: string;
  requestSchema?: string;
  responseSchema?: string;
}

export interface TaskBreakdown {
  metadata: {
    created: string;
    updated: string;
    version: string;
    featureName: string;
  };
  contextAnalysis: {
    problemDefinition: string;
    technicalApproach: string;
    codebasePatterns: string;
    externalDocs: string;
  };
  tasks: Task[];
  dependencies: TaskDependency[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  estimatedHours: number;
  userStory: string;
  contextAnalysis: {
    whatExists: string[];
    whatsMissing: string[];
  };
  fileStructureChanges: {
    newFiles: string[];
    modifiedFiles: string[];
    movedFiles: Array<{ from: string; to: string }>;
  };
  implementationDetails: {
    files: string[];
    functions: string[];
    apiEndpoints: string[];
    databaseChanges: string[];
  };
  technicalSpecifications: string;
  implementationConstraints: string[];
  externalDependencies: string[];
  integrationPoints: string[];
  acceptanceCriteria: string[];
  successDefinition: string;
  outOfScope: string[];
  dependencies: string[];
  notes?: string;
  assignedTo?: string;
  createdDate: string;
  updatedDate: string;
}

export interface TaskDependency {
  taskId: string;
  dependsOn: string[];
  blockedBy?: string[];
  blocks?: string[];
}

// Utility types for validation
export type Priority = 'P0' | 'P1' | 'P2';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Schema validation helpers
export const validateProblemDefinition = (data: unknown): data is ProblemDefinition => {
  // Basic structure validation
  const obj = data as ProblemDefinition;
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.metadata === 'object' &&
    typeof obj.problemStatement === 'string' &&
    typeof obj.why === 'string' &&
    Array.isArray(obj.successCriteria) &&
    typeof obj.constraints === 'object' &&
    Array.isArray(obj.users)
  );
};

export const validateTechnicalApproach = (data: unknown): data is TechnicalApproach => {
  const obj = data as TechnicalApproach;
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.metadata === 'object' &&
    typeof obj.technologyStack === 'object' &&
    Array.isArray(obj.dataModels) &&
    typeof obj.architecture === 'object' &&
    typeof obj.security === 'object'
  );
};

export const validateTaskBreakdown = (data: unknown): data is TaskBreakdown => {
  const obj = data as TaskBreakdown;
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.metadata === 'object' &&
    typeof obj.contextAnalysis === 'object' &&
    Array.isArray(obj.tasks) &&
    Array.isArray(obj.dependencies)
  );
};

// Default templates for new files
export const createProblemTemplate = (featureName: string): ProblemDefinition => ({
  metadata: {
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    version: '1.0.0',
    featureName,
  },
  problemStatement: '',
  why: '',
  successCriteria: [],
  constraints: {
    technical: '',
    business: '',
    scope: '',
    nonGoals: '',
  },
  users: [],
});

export const createTechnicalTemplate = (featureName: string): TechnicalApproach => ({
  metadata: {
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    version: '1.0.0',
    featureName,
  },
  technologyStack: {
    language: '',
    framework: '',
    dependencies: [],
    database: '',
    infrastructure: '',
  },
  dataModels: [],
  architecture: {
    components: [],
    apiEndpoints: [],
    integrationPoints: [],
    fileOrganization: [],
  },
  security: {
    authentication: '',
    authorization: '',
    validation: '',
    errorHandling: '',
  },
});

export const createTaskTemplate = (featureName: string): TaskBreakdown => ({
  metadata: {
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    version: '1.0.0',
    featureName,
  },
  contextAnalysis: {
    problemDefinition: '',
    technicalApproach: '',
    codebasePatterns: '',
    externalDocs: '',
  },
  tasks: [],
  dependencies: [],
});