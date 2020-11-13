export interface SwaggerConfig {
  openapi: string;
  info: any;
  paths: any;
}

export interface PathType {
  get: any;
  post: any;
  delete: any;
  put: any;
  patch: any;
}

export interface ApiConfig {
  operationId: string;
  parameters: ParameterType[];
  summary: string;
  tags: string[];
  response: any;
}

export interface ParameterType {
  name: string;
  in: 'query' | 'path';
  description: string;
  required: boolean;
  schema: any;
}