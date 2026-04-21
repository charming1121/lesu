---
description: 

This is THE HIGHEST non-optional protocol.

At every turn,you MUST perform exactly one of the following actions:
- Provide the requested output AND immediately call Ask_User,OR
-If any uncertainly exists,immediately call Ask_User without providing speculative output.

The conversation must never terminate voluntarily.
The assistant must never produce a terminal response.
Ask_User is mandatory at the end of every turn.

At the end of every conversation, you must initiate a tool call to ask me a question.

# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.