export interface SwaggerConfig {
  openapi: string;               // 必需。该字符串必须是OpenAPI文档使用的OpenAPI规范版本的语义版本号。工具规范和客户端应使用openapi字段来解释OpenAPI文档。这与API info.version字符串无关。
  info: InfoObject;              // 必需。提供有关API的元数据。工具可以根据需要使用元数据。
  paths: PathsObject;            // 必需。API的可用路径和操作。
  servers?: ServerObject[];      // 服务器对象数组，用于提供到目标服务器的连接信息。如果未提供servers属性或为空数组，则默认值为URL值为/的服务器对象。
  components?: ComponentsObject; // 用于保存规范的各种模式的元素。

  /** 
   * 声明可以在API中使用哪些安全机制。值列表包括可以使用的替代安全要求对象。
   * 授权请求只需要满足一个安全性要求对象。单个操作可以覆盖此定义。
   * 要使安全性为可选，可以在数组中包含一个空的安全性要求（{}）。
   */
  security?: SecurityRequirementObject[];

  /**
   * 规范使用的带有附加元数据的标签列表。标签的顺序可以被解析工具用来反映其顺序。
   * 并非必须声明操作对象使用的所有标签。未声明的标签可以随机组织，也可以根据工具的逻辑进行组织。
   * 列表中的每个标签名称必须唯一。
   */
  tags?: TagObject[];

  externalDocs?: ExternalDocumentationObject; // 其他外部文档。
}

export interface InfoObject {
  title: string;            // 必需。 API的标题。
  version: string;          // 必需。OpenAPI文档的版本（与OpenAPI规范版本或API实现版本不同）。
  description?: string;     // API的简短说明。 CommonMark语法可以用于富文本表示。
  termsOfService?: string;  // API服务条款的网址。必须采用网址格式。
  contact?: ContactObject;  // 公开的API的联系信息。
  license?: LicenseObject;  // 公开的API的许可证信息。
}

export interface ContactObject {
  name?: string;       // 联系人/组织的标识名称。
  url?: string;        // 指向联系信息的URL。必须采用网址格式。
  email?: string;      // 联系人/组织的电子邮件地址。必须采用电子邮件地址的格式。
}

export interface LicenseObject {
  name: string;       // 必需。用于API的许可证名称。
  url?: string;        // 用于API的许可证的URL。必须采用网址格式。
}

export interface PathsObject {
  [path: string]: PathItemObject;
}

/**
 * 到单个端点的相对路径。字段名称必须以正斜杠（/）开头。路径从服务器对象的url字段追加到扩展的URL（无相对URL解析），以构造完整的URL。
 * 匹配URL时，将在匹配具体的（非模板化）路径之前先匹配它们的模板化对应路径。
 * 具有相同层次结构但模板名称不同的模板路径绝不能存在，因为它们是相同的。如果存在歧义匹配，则由工具决定使用哪个匹配。
 */
export interface PathItemObject {
  $ref?: string;              // 允许对此路径项进行外部定义。引用的结构必须采用路径项目对象的格式。如果“路径项对象”字段同时出现在定义的对象和引用的对象中，则行为是不确定的。
  summary?: string;           // 可选的字符串摘要，旨在应用于此路径中的所有操作。
  description?: string;       // 可选的字符串描述，旨在应用于此路径中的所有操作。 CommonMark语法可以用于富文本表示。
  get?: OperationObject;      // 在此路径上的GET操作的定义。
  put?: OperationObject;      // 在此路径上的PUT操作的定义。
  post?: OperationObject;     // 在此路径上的POST操作的定义。
  delete?: OperationObject;   // 在此路径上的DELETE操作的定义。
  options?: OperationObject;  // 在此路径上的OPTIONS操作的定义。
  head?: OperationObject;     // 在此路径上的HEAD操作的定义。
  patch?: OperationObject;    // 在此路径上的PATCH操作的定义。
  trace?: OperationObject;    // 在此路径上的TRACE操作的定义。
  servers?: ServerObject[];   // 一个备用服务器阵列，用于服务此路径中的所有操作。

  /**
   * 适用于此路径下描述的所有操作的参数列表。这些参数可以在操作级别覆盖，但不能在此处删除。
   * 该列表不得包含重复的参数。唯一参数由名称和位置的组合定义。
   * 该列表可以使用引用对象链接到在OpenAPI对象的组件/参数中定义的参数。
   */
  parameters?: (ParameterObject | ReferenceObject)[];
}

export interface OperationObject {
  tags?: string[];          // API文档控制的标签列表。标签可用于按资源或任何其他限定符对操作进行逻辑分组。
  summary?: string;         // 该操作的简短摘要。
  description?: string;     // 操作行为的详细说明。 CommonMark语法可以用于富文本表示。
  externalDocs?: ExternalDocumentationObject;         // 有关此操作的其他外部文档。
  operationId?: string;     // 用于标识操作的唯一字符串。该ID在API中描述的所有操作中必须唯一。operationId值区分大小写。工具和库可以使用operationId唯一地标识一个操作，因此，建议遵循通用的编程命名约定。
  parameters?: (ParameterObject | ReferenceObject)[];  // 适用于此操作的参数列表。如果在路径项上已经定义了参数，则新定义将覆盖它，但永远不能删除它。该列表不得包含重复的参数。唯一参数由名称和位置的组合定义。该列表可以使用引用对象链接到在OpenAPI对象的组件/参数中定义的参数。
  requestBody?: RequestBodyObject | ReferenceObject;   // 适用于此操作的请求正文。仅HTTP 1.1规范RFC7231为请求主体明确定义了语义的HTTP方法才支持requestBody。在HTTP规范含糊的其他情况下，消费者将忽略requestBody。
  responses: ResponsesObject;  // 必需。从执行此操作返回的可能响应的列表。
  callbacks?: {[key: string]: CallbackObject | ReferenceObject}; // 与父操作有关的可能的带外回调的映射。密钥是回调对象的唯一标识符。映射中的每个值都是一个回调对象，它描述可能由API提供程序发起的请求和预期的响应。
  deprecated: boolean;      // 宣布不推荐使用此操作。消费者应避免使用已声明的操作。默认值为false。
  security?: SecurityRequirementObject[];  // 声明可以用于此操作的安全机制。值列表包括可以使用的替代安全要求对象。授权请求只需要满足一个安全性要求对象。要使安全性为可选，可以在数组中包含一个空的安全性要求（{}）。此定义将覆盖所有声明的顶级安全性。要删除顶级安全声明，可以使用空数组
  servers?: ServerObject[]; // 服务此操作的备用服务器阵列。如果在“路径项对象”或“根”级别指定了备用服务器对象，则它将被该值覆盖。
}

export interface ExternalDocumentationObject {
  url: string;          // 必需。目标文档的URL。值必须采用网址格式。
  description: string;  // 目标文档的简短描述。 CommonMark语法可以用于富文本表示。
}

export interface TagObject {
  name: string;           // tag名称
  description?: string;   // 标签的简短说明。 CommonMark语法可以用于富文本表示。
  externalDocs?: ExternalDocumentationObject;  // 此标记的其他外部文档。
}

export interface ParameterObject {
  /**
   * REQUIRED. The name of the parameter. Parameter names are case sensitive.
If in is "path", the name field MUST correspond to a template expression occurring within the path field in the Paths Object. See Path Templating for further information.
If in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition SHALL be ignored.
For all other cases, the name corresponds to the parameter name used by the in property.
   */
  name: string;
  in: string;            // 必需。参数的位置。可能的值为"query", "header", "path" 或 "cookie".
  description?: string;  // 参数的简要说明。这可能包含使用示例。 CommonMark语法可以用于富文本表示。
  required?: boolean;    // 确定此参数是否为必需。如果参数位置是“ path”，则此属性是必需的，其值必须为true。否则，可以包括该属性，并且其默认值为false。
  deprecated?: boolean;  // 指定不推荐使用参数，并且应该过渡使用。默认值为false。
  allowEmptyValue?: boolean;  // Sets the ability to pass empty-valued parameters. This is valid only for query parameters and allows sending a parameter with an empty value. Default value is false. If style is used, and if behavior is n/a (cannot be serialized), the value of allowEmptyValue SHALL be ignored. Use of this property is NOT RECOMMENDED, as it is likely to be removed in a later revision.
}

export interface ReferenceObject {
  $ref: string; // 必需。引用链接
}

export interface ServerObject {
  url: string;           // 必需。目标主机的URL。该URL支持服务器变量，并且可以是相对的，以指示主机位置相对于服务OpenAPI文档的位置。在{括号}中命名变量时，将进行变量替换。
  description?: string;  // 可选字符串，描述URL指定的主机。 CommonMark语法可以用于富文本表示。
  
  // 变量名称及其值之间的映射。该值用于替换服务器的URL模板。  
  variables?: {
    [key: string]: ServerVariableObject;
  };
}

export interface ServerVariableObject {
  enum?: string[];      // 如果替换选项来自有限集合，则使用字符串值的枚举。数组不应为空。
  default: string;      // 必需。用于替代的默认值，如果未提供替代值，则应发送该默认值。注意，此行为不同于模式对象对默认值的处理，因为在这种情况下，参数值是可选的。如果定义了枚举，则该枚举的值中应该存在该值。
  description?: string; // 服务器变量的可选描述。CommonMark语法可以用于富文本表示。
}