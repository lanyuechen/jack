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

export interface ParameterObject {
  /**
   * 必需。参数名称。大小写敏感。
   * 如果in==="path"，那么name字段必须对应于在Paths对象的path字段中出现的模板表达式，有关详细信息，请参阅路径模板。
   * 如果in==="header"，而name字段是"Accept"、"Content-Type"或"Authorization"，则忽略参数定义。
   * 对于所有其他情况，名称对应于in属性使用的参数名称。
   */
  name: string;
  in: string;            // 必需。参数的位置。可能的值为"query", "header", "path" 或 "cookie".
  description?: string;  // 参数的简要说明。这可能包含使用示例。 CommonMark语法可以用于富文本表示。
  required?: boolean;    // 确定此参数是否为必需。如果参数位置是“ path”，则此属性是必需的，其值必须为true。否则，可以包括该属性，并且其默认值为false。
  deprecated?: boolean;  // 指定不推荐使用参数，并且应该过渡使用。默认值为false。
  allowEmptyValue?: boolean;  // 设置传递空值参数的能力。这只对查询参数有效，并允许发送带有空值的参数。默认值为false。如果使用样式，如果行为是n/a(不能序列化)，allowEmptyValue的值将被忽略。不建议使用此属性，因为它很可能在以后的修订中被删除。
}

export interface RequestBodyObject {
  content: {[key: string]: MediaTypeObject};  // 必需。请求正文的内容。关键字是媒体类型或媒体类型范围，值描述了它。对于与多个键匹配的请求，仅最特定的键适用。例如"text/plain"取代"text/*""
  description?: string;                       // 请求正文的简短描述。这可能包含使用示例。 CommonMark语法可以用于富文本表示。
  required?: boolean;                         // 确定请求中是否需要请求主体。默认为false。
}

export interface MediaTypeObject {
  schema?: SchemaObject | ReferenceObject;   // 定义请求，响应或参数的内容的模式。
  example?: any;                             // 媒体类型的示例。示例对象应该采用媒体类型指定的正确格式。"example"字段与"examples"字段互斥。此外，如果引用包含示例的模式，则"examples"值将覆盖该模式提供的"example"。
  examples?: {[key: string]: ExampleObject | ReferenceObject}; // Examples of the media type. Each example object SHOULD match the media type and specified schema if present. The examples field is mutually exclusive of the example field. Furthermore, if referencing a schema which contains an example, the examples value SHALL override the example provided by the schema.
  encoding?: {[key: string]: EncodingObject};  // A map between a property name and its encoding information. The key, being the property name, MUST exist in the schema as a property. The encoding object SHALL only apply to requestBody objects when the media type is multipart or application/x-www-form-urlencoded.
}

export interface EncodingObject {
  contentType: string;  // The Content-Type for encoding a specific property. Default value depends on the property type: for string with format being binary – application/octet-stream; for other primitive types – text/plain; for object - application/json; for array – the default is defined based on the inner type. The value can be a specific media type (e.g. application/json), a wildcard media type (e.g. image/*), or a comma-separated list of the two types.
  headers: {[key: string]: HeaderObject | ReferenceObject};   // A map allowing additional information to be provided as headers, for example Content-Disposition. Content-Type is described separately and SHALL be ignored in this section. This property SHALL be ignored if the request body media type is not a multipart.
  style: string;  // Describes how a specific property value will be serialized depending on its type. See Parameter Object for details on the style property. The behavior follows the same values as query parameters, including default values. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded.
  explode: boolean; // When this is true, property values of type array or object generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this property has no effect. When style is form, the default value is true. For all other styles, the default value is false. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded.
  allowReserved: boolean; // Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986 :/?#[]@!$&'()*+,;= to be included without percent-encoding. The default value is false. This property SHALL be ignored if the request body media type is not application/x-www-form-urlencoded.
}

export interface ResponsesObject {
  default: ResponseObject | ReferenceObject;                  // The documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses. A Reference Object can link to a response that the OpenAPI Object's components/responses section defines.
  [HTTPStatusCode: number]: ResponseObject | ReferenceObject; // Any HTTP status code can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. A Reference Object can link to a response that is defined in the OpenAPI Object's components/responses section. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character X. For example, 2XX represents all response codes between [200-299]. Only the following range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.
}

export interface ResponseObject {
  description: string;    // REQUIRED. A short description of the response. CommonMark syntax MAY be used for rich text representation.
  headers: {[key: string]: HeaderObject | ReferenceObject}; // Maps a header name to its definition. RFC7230 states header names are case insensitive. If a response header is defined with the name "Content-Type", it SHALL be ignored.
  content: {[key: string]: MediaTypeObject};  // A map containing descriptions of potential response payloads. The key is a media type or media type range and the value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
  links: {[key: string]: LinkObject | ReferenceObject}; // A map of operations links that can be followed from the response. The key of the map is a short name for the link, following the naming constraints of the names for Component Objects.
}

export interface CallbackObject {
  [expression: string]: PathItemObject;   // A Path Item Object used to define a callback request and expected responses. A complete example is available.
}

export interface ExampleObject {
  summary: string;        // Short description for the example.
  description: string;    // Long description for the example. CommonMark syntax MAY be used for rich text representation.
  value: any;             // Embedded literal example. The value field and externalValue field are mutually exclusive. To represent examples of media types that cannot naturally represented in JSON or YAML, use a string value to contain the example, escaping where necessary.
  externalValue: string;  // A URL that points to the literal example. This provides the capability to reference examples that cannot easily be included in JSON or YAML documents. The value field and externalValue field are mutually exclusive.
}

export interface LinkObject {
  operationRef: string;       // A relative or absolute URI reference to an OAS operation. This field is mutually exclusive of the operationId field, and MUST point to an Operation Object. Relative operationRef values MAY be used to locate an existing Operation Object in the OpenAPI definition.
  operationId: string;        // The name of an existing, resolvable OAS operation, as defined with a unique operationId. This field is mutually exclusive of the operationRef field.
  parameters: {[key: string]: any | {expression: string}}   // A map representing parameters to pass to an operation as specified with operationId or identified via operationRef. The key is the parameter name to be used, whereas the value can be a constant or an expression to be evaluated and passed to the linked operation. The parameter name can be qualified using the parameter location [{in}.]{name} for operations that use the same parameter name in different locations (e.g. path.id).
  requestBody: any | {expression: string};  // A literal value or {expression} to use as a request body when calling the target operation.
  description: string;        // A description of the link. CommonMark syntax MAY be used for rich text representation.
  server: ServerObject;       // A server object to be used by the target operation.
}

/**
 * The Header Object follows the structure of the ParameterObject with the following changes:
 * 1. name MUST NOT be specified, it is given in the corresponding headers map.
 * 2. in MUST NOT be specified, it is implicitly in header.
 * 3. All traits that are affected by the location MUST be applicable to a location of header (for example, style).
 */
export interface HeaderObject extends ParameterObject {

}

export interface TagObject {
  name: string;           // tag名称
  description?: string;   // 标签的简短说明。 CommonMark语法可以用于富文本表示。
  externalDocs?: ExternalDocumentationObject;  // 此标记的其他外部文档。
}

export interface ReferenceObject {
  $ref: string; // 必需。引用链接
}

export interface SchemaObject {

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

export interface ComponentsObject {
  schemas: {[key: string]: SchemaObject | ReferenceObject}; // An object to hold reusable Schema Objects.
  responses: {[key: string]: SchemaObject | ReferenceObject}; // An object to hold reusable Response Objects.
  parameters: {[key: string]: ParameterObject | ReferenceObject}; // An object to hold reusable Parameter Objects.
  examples: {[key: string]: ExampleObject | ReferenceObject}; // An object to hold reusable Example Objects.
  requestBodies: {[key: string]: RequestBodyObject | ReferenceObject}; //	An object to hold reusable Request Body Objects.
  headers: {[key: string]: HeaderObject | ReferenceObject}; // An object to hold reusable Header Objects.
  securitySchemes: {[key: string]: SecuritySchemeObject | ReferenceObject}; // An object to hold reusable Security Scheme Objects.
  links: {[key: string]: LinkObject | ReferenceObject}; // An object to hold reusable Link Objects.
  callbacks: {[key: string]: CallbackObject | ReferenceObject}; // An object to hold reusable Callback Objects.
}

export interface SecuritySchemeObject {
  type: string;             // Any	REQUIRED. The type of the security scheme. Valid values are "apiKey", "http", "oauth2", "openIdConnect".
  description: string;      // Any	A short description for security scheme. CommonMark syntax MAY be used for rich text representation.
  name: string;             // apiKey	REQUIRED. The name of the header, query or cookie parameter to be used.
  in: string;               // apiKey	REQUIRED. The location of the API key. Valid values are "query", "header" or "cookie".
  scheme: string;           // http	REQUIRED. The name of the HTTP Authorization scheme to be used in the Authorization header as defined in RFC7235. The values used SHOULD be registered in the IANA Authentication Scheme registry.
  bearerFormat: string;     // http ("bearer")	A hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.
  flows: OAuthFlowsObject;  // oauth2	REQUIRED. An object containing configuration information for the flow types supported.
  openIdConnectUrl: string; // openIdConnect	REQUIRED. OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of a URL.
}

export interface OAuthFlowsObject {
  implicit: OAuthFlowObject;  // Configuration for the OAuth Implicit flow
  password: OAuthFlowObject;  // Configuration for the OAuth Resource Owner Password flow
  clientCredentials: OAuthFlowObject;  // Configuration for the OAuth Client Credentials flow. Previously called application in OpenAPI 2.0.
  authorizationCode: OAuthFlowObject;  // Configuration for the OAuth Authorization Code flow. Previously called accessCode in OpenAPI 2.0.
}

export interface OAuthFlowObject {
  authorizationUrl: string;         // oauth2 ("implicit", "authorizationCode")	REQUIRED. The authorization URL to be used for this flow. This MUST be in the form of a URL.
  tokenUrl: string;                 // oauth2 ("password", "clientCredentials", "authorizationCode")	REQUIRED. The token URL to be used for this flow. This MUST be in the form of a URL.
  refreshUrl: string;               // oauth2	The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL.
  scopes: {[key: string]: string};  // oauth2	REQUIRED. The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it. The map MAY be empty.
}

export interface SecurityRequirementObject {
  [name: string]: string; // Each name MUST correspond to a security scheme which is declared in the Security Schemes under the Components Object. If the security scheme is of type "oauth2" or "openIdConnect", then the value is a list of scope names required for the execution, and the list MAY be empty if authorization does not require a specified scope. For other security scheme types, the array MUST be empty.
}