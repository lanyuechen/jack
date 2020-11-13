import request from './request';

import { SwaggerConfig, ParameterType } from './data';

export default class Jack {
  info: any;

  constructor(config: SwaggerConfig) {
    this.info = config.info;

    this.generageApi(config);
  }

  generageApi(config: SwaggerConfig) {
    if (!config.paths) {
      return;
    }
    Object.entries(config.paths).forEach(([path, methods]: any) => {
      Object.entries(methods).forEach(([method, cfg]: any) => {
        this.defineApi(path, method, cfg);
      });
    });
  }

  defineApi(path: string, method: string, cfg: any) {
    if (!cfg.operationId) {
      return;
    }
    Object.defineProperty(this, cfg.operationId, {
      value: async (args: any) => {
        if (cfg.parameters) {
          // 参数验证
          cfg.parameters.forEach((param: ParameterType) => {
            if (param.required && typeof args[param.name] === 'undefined') {
              throw new Error(`${param.name}参数不能为空 ${param.description || ''}`);
            }
          });

          // path处理
          cfg.parameters.forEach((param: ParameterType) => {
            if (param.in === 'path') {
              path = path.replace(`{${param.name}}`, args[param.name]);
            }
          });
        } 

        console.log('[request]', path)

        const res = await request(path, {
          method,
          [method === 'get' ? 'params' : 'data']: args,
        });
        return res;
      },
    });
  }
}

/**
{
  "openapi": "3.0.0",
  "info": {
    "title": "xxxx",
    "contact": {
      "name": "contact",
      "url": "https://xxx"
    },
    "version": "1.0.0"
  },
  "paths": {
    "/test": {
      "get": {
        "tags": [
          "test"
        ],
        "parameters": [
          {
            "name": "rsid",
            "in": "path",
            "required": true
          }
        ],
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/rs"
                }
              }
            },
            "description": "test"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "rs": {
        "type": "object",
        "properties": {
          "name": {
            "description": "姓名",
            "type": "string"
          },
          "age": {
            "description": "年龄",
            "type": "number"
          }
        },
        "required": [
          "name"
        ]
      }
    }
  }
}
 */