# Shared Chat System Documentation

## Обзор

Система Shared Chat позволяет пользователям делиться своими разговорами с AI через публичные ссылки. Это создает возможность для создания галерей интересных диалогов, социального взаимодействия и публичного доступа к контекстам без необходимости авторизации.

## Архитектура

### Компоненты системы

1. **SharedContextService** - основной сервис для управления shared контекстами
2. **SharedController** - публичный контроллер для доступа к shared контекстам
3. **ChatController** - аутентифицированные endpoints для управления shared контекстами
4. **Файловая система** - хранение shared контекстов в `logs/shared/`

### Схема работы

```mermaid
graph TD
    A[Пользователь выбирает контекст] --> B[POST /chat/shared]
    B --> C[SharedContextService.shareContext]
    C --> D[Копирование данных из user log]
    D --> E[Создание JSON файла в logs/shared/]
    E --> F[Генерация shareId]
    F --> G[Возврат shareUrl]
    
    H[Публичный доступ] --> I[GET /shared/{shareId}]
    I --> J[SharedController.getSharedContext]
    J --> K[Чтение из logs/shared/]
    K --> L[Возврат данных без авторизации]
```

## API Endpoints

### Аутентифицированные endpoints

#### 1. Создание shared контекста

**POST** `/chat/shared`

**Headers:**
```
Authorization: Bearer <privy-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "contextId": "f3aa7108-44f5-4f1f-8953-1c7869b3e6db",
  "title": "Мой интересный разговор",
  "description": "Обсуждение AI технологий",
  "isPublic": true
}
```

**Response:**
```json
{
  "success": true,
  "shareId": "share_1756990000000_abc123def",
  "shareUrl": "http://localhost:3001/shared/share_1756990000000_abc123def",
  "message": "Context shared successfully"
}
```

#### 2. Получение списка shared контекстов пользователя

**GET** `/chat/shared`

**Headers:**
```
Authorization: Bearer <privy-token>
```

**Response:**
```json
{
  "success": true,
  "sharedContexts": [
    {
      "shareId": "share_1756990000000_abc123def",
      "title": "Мой интересный разговор",
      "description": "Обсуждение AI технологий",
      "totalMessages": 2,
      "createdAt": "2025-01-09T12:30:00.000Z",
      "lastUpdated": "2025-01-09T12:30:05.000Z",
      "model": "dobby-70b"
    }
  ]
}
```

#### 3. Удаление shared контекста

**POST** `/chat/shared/{shareId}/delete`

**Headers:**
```
Authorization: Bearer <privy-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Shared context deleted successfully"
}
```

### Публичные endpoints

#### 1. Получение shared контекста

**GET** `/shared/{shareId}`

**Headers:** Не требуются

**Response:**
```json
{
  "success": true,
  "sharedContext": {
    "shareId": "share_1756990000000_abc123def",
    "title": "Мой интересный разговор",
    "description": "Обсуждение AI технологий",
    "messages": [
      {
        "id": "13c61ddb-3d54-4977-82a7-50ab16e74d51",
        "role": "user",
        "content": "Who is Dobby AI?",
        "timestamp": "2025-01-09T12:30:00.000Z",
        "sessionId": "1756987822429x5ex1r3p0",
        "contextId": "f3aa7108-44f5-4f1f-8953-1c7869b3e6db",
        "model": "dobby-70b"
      },
      {
        "id": "06d33d8f-ffcd-4d08-93c1-9d3258ea3254",
        "role": "assistant",
        "content": "Dobby AI is an advanced AI assistant...",
        "timestamp": "2025-01-09T12:30:05.000Z",
        "sessionId": "1756987822429x5ex1r3p0",
        "contextId": "f3aa7108-44f5-4f1f-8953-1c7869b3e6db",
        "model": "dobby-70b"
      }
    ],
    "totalMessages": 2,
    "createdAt": "2025-01-09T12:30:00.000Z",
    "lastUpdated": "2025-01-09T12:30:05.000Z",
    "model": "dobby-70b"
  }
}
```

## Структура данных

### Shared Context JSON файл

**Расположение:** `logs/shared/{shareId}.json`

```json
{
  "shareId": "share_1756990000000_abc123def",
  "title": "Мой интересный разговор",
  "description": "Обсуждение AI технологий",
  "originalUserId": "did_privy_cmf5biepk00ltjv0bff9e6knh",
  "originalContextId": "f3aa7108-44f5-4f1f-8953-1c7869b3e6db",
  "messages": [
    {
      "id": "13c61ddb-3d54-4977-82a7-50ab16e74d51",
      "role": "user",
      "content": "Who is Dobby AI?",
      "timestamp": "2025-01-09T12:30:00.000Z",
      "sessionId": "1756987822429x5ex1r3p0",
      "contextId": "f3aa7108-44f5-4f1f-8953-1c7869b3e6db",
      "model": "dobby-70b"
    },
    {
      "id": "06d33d8f-ffcd-4d08-93c1-9d3258ea3254",
      "role": "assistant",
      "content": "Dobby AI is an advanced AI assistant...",
      "timestamp": "2025-01-09T12:30:05.000Z",
      "sessionId": "1756987822429x5ex1r3p0",
      "contextId": "f3aa7108-44f5-4f1f-8953-1c7869b3e6db",
      "model": "dobby-70b"
    }
  ],
  "totalMessages": 2,
  "createdAt": "2025-01-09T12:30:00.000Z",
  "lastUpdated": "2025-01-09T12:30:05.000Z",
  "model": "dobby-70b"
}
```

### Поля данных

| Поле | Тип | Описание |
|------|-----|----------|
| `shareId` | string | Уникальный идентификатор shared контекста |
| `title` | string | Заголовок shared контекста |
| `description` | string | Описание shared контекста |
| `originalUserId` | string | ID пользователя, создавшего shared контекст |
| `originalContextId` | string | ID оригинального контекста |
| `messages` | array | Массив сообщений из контекста |
| `totalMessages` | number | Общее количество сообщений |
| `createdAt` | string | Дата создания shared контекста |
| `lastUpdated` | string | Дата последнего обновления |
| `model` | string | Модель AI, использованная в контексте |

## Процесс создания shared контекста

### 1. Инициализация

Пользователь выбирает контекст для публикации и заполняет форму:

```javascript
const shareData = {
  contextId: "f3aa7108-44f5-4f1f-8953-1c7869b3e6db",
  title: "Мой интересный разговор",
  description: "Обсуждение AI технологий",
  isPublic: true
};
```

### 2. Отправка запроса

```javascript
const response = await fetch('/chat/shared', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(shareData)
});
```

### 3. Обработка на сервере

1. **Валидация аутентификации** - проверка Privy токена
2. **Поиск контекста** - поиск в файле пользователя `logs/users/{userId}.json`
3. **Копирование данных** - извлечение всех сообщений контекста
4. **Генерация shareId** - создание уникального идентификатора
5. **Сохранение файла** - создание `logs/shared/{shareId}.json`
6. **Возврат ссылки** - генерация публичной ссылки

### 4. Генерация shareId

```typescript
const shareId = `share_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
// Пример: share_1756990000000_abc123def
```

## Публичный доступ

### Без авторизации

Любой пользователь может получить доступ к shared контексту по ссылке:

```javascript
// Прямой запрос к API
const response = await fetch('http://localhost:3001/shared/share_1756990000000_abc123def');
const sharedData = await response.json();

console.log(sharedData.sharedContext.title);
console.log(sharedData.sharedContext.messages);
```

### Frontend интеграция

```jsx
// React компонент для отображения shared контекста
const SharedChatView = ({ shareId }) => {
  const [sharedData, setSharedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSharedContext = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/shared/${shareId}`);
        
        if (!response.ok) {
          throw new Error('Shared context not found');
        }
        
        const data = await response.json();
        setSharedData(data.sharedContext);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSharedContext();
  }, [shareId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!sharedData) return <div>Not found</div>;

  return (
    <div className="shared-chat">
      <header>
        <h1>{sharedData.title}</h1>
        <p>{sharedData.description}</p>
        <div className="meta">
          <span>{sharedData.totalMessages} messages</span>
          <span>•</span>
          <span>Created {new Date(sharedData.createdAt).toLocaleDateString()}</span>
          {sharedData.model && (
            <>
              <span>•</span>
              <span>Model: {sharedData.model}</span>
            </>
          )}
        </div>
      </header>

      <div className="messages">
        {sharedData.messages.map((message, index) => (
          <div key={message.id || index} className={`message ${message.role}`}>
            <div className="content">{message.content}</div>
            <div className="timestamp">
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Управление shared контекстами

### Получение списка своих shared контекстов

```javascript
const getMySharedContexts = async () => {
  const response = await fetch('/chat/shared', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data.sharedContexts;
};
```

### Удаление shared контекста

```javascript
const deleteSharedContext = async (shareId) => {
  const response = await fetch(`/chat/shared/${shareId}/delete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data.success;
};
```

### Frontend компонент управления

```jsx
const SharedContextManager = () => {
  const [sharedContexts, setSharedContexts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSharedContexts = async () => {
    setLoading(true);
    try {
      const contexts = await getMySharedContexts();
      setSharedContexts(contexts);
    } catch (error) {
      console.error('Error loading shared contexts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shareId) => {
    if (!confirm('Are you sure you want to delete this shared context?')) return;
    
    try {
      await deleteSharedContext(shareId);
      loadSharedContexts(); // Reload the list
    } catch (error) {
      console.error('Error deleting shared context:', error);
    }
  };

  useEffect(() => {
    loadSharedContexts();
  }, []);

  return (
    <div className="shared-context-manager">
      <h2>My Shared Contexts</h2>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="contexts-list">
          {sharedContexts.map((context) => (
            <div key={context.shareId} className="context-item">
              <div className="context-info">
                <h3>{context.title}</h3>
                <p>{context.description}</p>
                <div className="meta">
                  {context.totalMessages} messages • 
                  Created {new Date(context.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="context-actions">
                <a
                  href={`/shared/${context.shareId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-link"
                >
                  View Public Link
                </a>
                <button
                  onClick={() => handleDelete(context.shareId)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Безопасность

### Принципы безопасности

1. **Изоляция данных** - shared контексты хранятся отдельно от пользовательских данных
2. **Контроль доступа** - только создатель может удалить shared контекст
3. **Публичный доступ** - любой может читать shared контекст по ссылке
4. **Нет авторизации** - публичные endpoints не требуют токенов

### Ограничения

- Shared контексты статичны (не обновляются автоматически)
- Нет ограничений на количество shared контекстов
- Нет срока действия shared контекстов
- Нет аналитики просмотров

## Тестирование

### Создание shared контекста

```bash
curl -X POST http://localhost:3001/chat/shared \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <privy-token>" \
  -d '{
    "contextId": "test-context-123",
    "title": "Test Shared Context",
    "description": "This is a test shared context",
    "isPublic": true
  }'
```

### Получение shared контекста

```bash
curl -X GET http://localhost:3001/shared/share_1756990000000_abc123def
```

### Получение списка shared контекстов

```bash
curl -X GET http://localhost:3001/chat/shared \
  -H "Authorization: Bearer <privy-token>"
```

### Удаление shared контекста

```bash
curl -X POST http://localhost:3001/chat/shared/share_1756990000000_abc123def/delete \
  -H "Authorization: Bearer <privy-token>"
```

## Интеграция с фронтендом

### React Hook

```javascript
// hooks/useSharedContext.js
import { useState, useCallback } from 'react';

export const useSharedContext = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shareContext = useCallback(async (contextId, title, description) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/chat/shared', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contextId,
          title,
          description,
          isPublic: true
        })
      });
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSharedContexts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/chat/shared', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      return data.sharedContexts;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSharedContext = useCallback(async (shareId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/chat/shared/${shareId}/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      return data.success;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    shareContext,
    getSharedContexts,
    deleteSharedContext,
    loading,
    error
  };
};
```

### Vue.js Composable

```javascript
// composables/useSharedContext.js
import { ref } from 'vue';

export function useSharedContext() {
  const loading = ref(false);
  const error = ref(null);

  const shareContext = async (contextId, title, description) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch('/chat/shared', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contextId,
          title,
          description,
          isPublic: true
        })
      });
      
      const data = await response.json();
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getSharedContexts = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch('/chat/shared', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      return data.sharedContexts;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteSharedContext = async (shareId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`/chat/shared/${shareId}/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      return data.success;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    shareContext,
    getSharedContexts,
    deleteSharedContext,
    loading,
    error
  };
}
```

## Примеры использования

### 1. Создание кнопки "Поделиться"

```jsx
const ShareButton = ({ contextId, contextTitle }) => {
  const { shareContext, loading } = useSharedContext();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const result = await shareContext(
        contextId,
        contextTitle || 'Shared Conversation',
        'A conversation shared from Dobby AI'
      );
      
      // Показываем ссылку пользователю
      navigator.clipboard.writeText(result.shareUrl);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing context:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button 
      onClick={handleShare} 
      disabled={loading || isSharing}
      className="share-btn"
    >
      {isSharing ? 'Sharing...' : 'Share Context'}
    </button>
  );
};
```

### 2. Галерея shared контекстов

```jsx
const SharedGallery = () => {
  const [sharedContexts, setSharedContexts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContexts = async () => {
      try {
        const contexts = await getMySharedContexts();
        setSharedContexts(contexts);
      } catch (error) {
        console.error('Error loading contexts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContexts();
  }, []);

  if (loading) return <div>Loading shared contexts...</div>;

  return (
    <div className="shared-gallery">
      <h2>My Shared Contexts</h2>
      <div className="gallery-grid">
        {sharedContexts.map((context) => (
          <div key={context.shareId} className="gallery-item">
            <h3>{context.title}</h3>
            <p>{context.description}</p>
            <div className="meta">
              {context.totalMessages} messages
            </div>
            <a
              href={`/shared/${context.shareId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="view-link"
            >
              View Public Link
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. Встраивание shared контекста

```jsx
const EmbeddedSharedChat = ({ shareId }) => {
  const [sharedData, setSharedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSharedContext = async () => {
      try {
        const response = await fetch(`/shared/${shareId}`);
        const data = await response.json();
        setSharedData(data.sharedContext);
      } catch (error) {
        console.error('Error loading shared context:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSharedContext();
  }, [shareId]);

  if (loading) return <div>Loading...</div>;
  if (!sharedData) return <div>Shared context not found</div>;

  return (
    <div className="embedded-shared-chat">
      <div className="header">
        <h2>{sharedData.title}</h2>
        <p>{sharedData.description}</p>
      </div>
      
      <div className="messages">
        {sharedData.messages.map((message, index) => (
          <div key={message.id || index} className={`message ${message.role}`}>
            <div className="content">{message.content}</div>
            <div className="timestamp">
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Заключение

Система Shared Chat предоставляет простой и эффективный способ для пользователей делиться своими разговорами с AI. Она обеспечивает:

- ✅ **Простота использования** - один клик для создания публичной ссылки
- ✅ **Безопасность** - изоляция данных и контроль доступа
- ✅ **Гибкость** - возможность поделиться любым контекстом
- ✅ **Удобство** - публичный доступ без регистрации
- ✅ **Управление** - создатель может удалить shared контекст

Эта система идеально подходит для создания социальных функций, галерей интересных диалогов и интеграции чата в публичные пространства.
