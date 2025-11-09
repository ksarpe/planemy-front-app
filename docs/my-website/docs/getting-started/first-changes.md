---
sidebar_position: 3
---

# Making Your First Changes

Learn how to modify the AI Planner codebase with practical examples.

## Add a New Component

Create a component in `web/src/components/`:

```tsx
// web/src/components/ui/MyComponent.tsx
import { useT } from "@shared/hooks/utils/useT";

export function MyComponent() {
  const t = useT();
  
  return (
    <div className="p-4 bg-bg rounded-lg">
      <h2 className="text-xl font-bold text-text">
        {t("myComponent.title")}
      </h2>
    </div>
  );
}
```

## Add Translations

Add to `shared/i18n/locales/en.json`:

```json
{
  "myComponent": {
    "title": "My Component"
  }
}
```

## Create an API Function

Add to `shared/api/myfeature.ts`:

```typescript
import { buildApiUrl } from "../config/api";

export async function getMyData(): Promise<MyDataResponse> {
  const response = await fetch(buildApiUrl("my-endpoint"), {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  
  return response.json();
}
```

## Create a React Query Hook

Add to `shared/hooks/myfeature/useMyData.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { getMyData } from "@shared/api/myfeature";

export function useMyData() {
  return useQuery({
    queryKey: ["myData"],
    queryFn: getMyData,
    staleTime: 5 * 60 * 1000,
  });
}
```

## Use in Component

```tsx
import { useMyData } from "@shared/hooks/myfeature/useMyData";

export function MyDataComponent() {
  const { data, isLoading, error } = useMyData();
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div>{data?.value}</div>;
}
```

## Next Steps

- [Development Conventions](/development/conventions)
- [Styling Guide](/development/styling)
