import mongoose from 'mongoose';
import { User } from './models/User';
import { Post } from './models/Post';
import { Comment } from './models/Comment';
import { connectDB, closeDB } from './config/db';

export const seedDatabase = async () => {
  try {
    const postCount = await Post.countDocuments();
    if (postCount > 0) {
      console.log(`Database already has ${postCount} posts. Skipping auto-seed.`);
      return;
    }

    console.log('Seeding initial database with sample users, posts, and comments...');

    // Clear existing data if any
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});

    // 1. Create Seed Users
    const alex = await User.create({
      name: 'Alex Rivers',
      email: 'alex@blognest.dev',
      password: 'Password123!',
      role: 'admin',
      bio: 'Full Stack Staff Engineer passionate about TypeScript, Node.js, distributed databases, and high-performance web systems.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    const sophia = await User.create({
      name: 'Sophia Chen',
      email: 'sophia@blognest.dev',
      password: 'Password123!',
      role: 'user',
      bio: 'Frontend Architect, open source contributor, and UI/UX advocate writing about React, accessibility, and CSS design.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    });

    const marcus = await User.create({
      name: 'Marcus Vance',
      email: 'marcus@blognest.dev',
      password: 'Password123!',
      role: 'user',
      bio: 'Cloud and DevOps engineer exploring modern microservices, observability, and containerization.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });

    // 2. Create Required Seed Posts
    const post1 = await Post.create({
      title: 'The Future of Web Development',
      excerpt:
        'From edge compute and AI integration to server components, explore how the web development ecosystem is transforming at lightning speed.',
      category: 'Web Development',
      tags: ['WebDev', 'Architecture', 'NextGen', 'Cloud'],
      featuredImage:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      author: alex._id,
      content: `## The Modern Web Revolution

The web development landscape has shifted tremendously over the past few years. We have moved from monolithic client-side single page applications towards blended architectures that leverage edge computing, streaming HTML, and intelligent caching strategies.

### 1. Edge-First Infrastructure
Traditional architectures forced requests to travel halfway across the globe to hit a centralized origin server. Today, compute runs at hundreds of points of presence (PoP) worldwide, executing business logic within milliseconds of the user.

### 2. The Rise of Full-Stack TypeScript
TypeScript has definitively won the enterprise and indie developer mindshare alike. Writing type-safe contracts across the entire stack—from database schemas with Mongoose/Prisma, to Express REST APIs, to React interfaces—virtually eliminates entire classes of runtime errors.

\`\`\`typescript
interface PostResponse {
  id: string;
  title: string;
  published: boolean;
  tags: string[];
}
\`\`\`

### 3. Pragmatic Tooling
Toolchains like Vite, esbuild, and tsx have reduced build times from minutes to milliseconds, giving developers instant feedback loops.

The future isn't about throwing away fundamentals; it's about combining rock-solid HTTP and browser standards with modern developer ergonomics.`,
    });

    const post2 = await Post.create({
      title: 'How I Started Learning Full Stack Development',
      excerpt:
        'A candid roadmap and honest reflections on transitioning from basic HTML/CSS to designing complete production backends and interactive frontends.',
      category: 'Career',
      tags: ['FullStack', 'Learning', 'Career', 'Advice'],
      featuredImage:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      author: sophia._id,
      content: `## Finding Order in the Chaos

When I wrote my very first \`<h1>Hello World</h1>\` tag, the journey ahead seemed impossibly daunting. The sheer volume of libraries, acronyms, and frameworks often felt like standing in front of a firehose.

### Phase 1: Mastering the Pillars
Before touching any UI library or backend framework, I spent dedicated months writing vanilla JavaScript, understanding:
- The Event Loop and Asynchronous execution (Promises, \`async/await\`)
- DOM manipulation and browser rendering lifecycles
- HTTP methods, request headers, and status codes

### Phase 2: Building Real Backends
Learning Express.js and MongoDB was the true turning point. Realizing that the web is simply clients sending JSON to servers, querying databases, and receiving structured responses demystified the magic.

> "Don't just follow tutorials step-by-step. Break the code on purpose and see what fails. That is when real learning happens."

### Key Takeaways for Beginners
1. **Build small projects end-to-end**: Auth, CRUD, and deployment teach you 10x more than watching courses.
2. **Read error logs patiently**: Stack traces are clues, not personal attacks.
3. **Commit daily**: Consistency compound interest will surprise you.`,
    });

    const post3 = await Post.create({
      title: 'Why Clean Code Matters',
      excerpt:
        'Writing code for machines is easy; writing code for human collaborators six months from now is where true engineering excellence begins.',
      category: 'Best Practices',
      tags: ['CleanCode', 'Refactoring', 'Architecture', 'TypeScript'],
      featuredImage:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      author: alex._id,
      content: `## The True Cost of Technical Debt

Any developer can write code that a compiler or interpreter executes. But professional software engineering is fundamentally about communication: writing software that your teammates—and your future self—can read, test, maintain, and confidently iterate upon.

### 1. Meaningful Names Over Comments
If you have to write a comment explaining what a variable or function does, consider renaming it first.

\`\`\`typescript
// Avoid vague variable names:
const d = 86400;

// Write expressive identifiers:
const SECONDS_PER_DAY = 86400;
\`\`\`

### 2. Single Responsibility Principle
A function should do one thing, and do it exceptionally well. When a controller function handles validation, database querying, email notifications, and analytics logging all in one 300-line block, testing becomes a nightmare.

### 3. Predictable Error Handling
Fail fast and fail explicitly. Always handle rejected promises, return semantic HTTP error codes, and never swallow exceptions silently without logging or notifying the caller.`,
    });

    const post4 = await Post.create({
      title: 'Modern Frontend Architecture and Component Patterns',
      excerpt:
        'How to structure enterprise-grade React applications with compound components, custom hooks, and centralized state management.',
      category: 'Web Development',
      tags: ['React', 'TypeScript', 'Frontend', 'DesignPatterns'],
      featuredImage:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      author: marcus._id,
      content: `## Structuring React for Longevity

As frontend applications scale from a few pages to complex software suites, directory organization and component contracts determine developer velocity.

### Separation of Concerns
1. **Container vs Presentational Components**: Keep data fetching, context consumers, and side-effects separated from pure visual UI cards and buttons.
2. **Custom Hooks for Domain Logic**: Encapsulate API mutations, form validation, and local storage into testable hooks like \`usePosts()\` or \`useAuth()\`.
3. **Strict Typing**: Never use \`any\`. Model API responses with clean TypeScript interfaces.`,
    });

    // 3. Create Seed Comments
    await Comment.create({
      content:
        'Incredible overview! The shift towards full-stack TypeScript has been the biggest productivity boost in our team. Excited to see where edge computing heads next.',
      author: sophia._id,
      post: post1._id,
    });

    await Comment.create({
      content:
        'Totally agree on edge PoPs. Latency improvements for worldwide users are game-changing for interactive platforms.',
      author: marcus._id,
      post: post1._id,
    });

    await Comment.create({
      content:
        'This roadmap resonates so much with me. Getting past tutorial hell requires building something with a real database and persistent auth just like BlogNest!',
      author: alex._id,
      post: post2._id,
    });

    await Comment.create({
      content:
        'The quote about breaking code on purpose is pure gold. Whenever I intentionally test error boundaries, my understanding doubles.',
      author: marcus._id,
      post: post2._id,
    });

    await Comment.create({
      content:
        'Clean code is a superpower. The time saved in code reviews and debugging pays for itself ten times over.',
      author: sophia._id,
      post: post3._id,
    });

    // Sync comment counts
    post1.commentCount = 2;
    await post1.save();

    post2.commentCount = 2;
    await post2.save();

    post3.commentCount = 1;
    await post3.save();

    console.log('Database successfully seeded with realistic blog posts and comments!');
  } catch (error) {
    console.error('Error during database seed:', error);
  }
};

// If run directly from CLI (npm run seed)
if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await closeDB();
      console.log('Seed script finished successfully.');
      process.exit(0);
    } catch (err) {
      console.error('Seed script failed:', err);
      process.exit(1);
    }
  })();
}
