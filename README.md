## Climbing information scraper:
This actor's purpose is to simplify finding climbing routes in a region, either with filters applied, or just any routes. It collects information about routes and exports it in the default dataset in a unified format

### Running the actor:
To run the Actor use the following command:

```bash
apify run
```

### Output schema:
{
    title: string;
    difficulty: string;
    type: string;
    description: string;
    location: string;
    routeUrl: string;
}