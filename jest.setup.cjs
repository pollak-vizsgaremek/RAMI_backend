// Set NODE_ENV to test before running tests
process.env.NODE_ENV = "test";

// Increase Jest timeout for database operations
jest.setTimeout(10000);

// Lazy load and setup server
let setupPromise = null;

// Setup before all tests
beforeAll(async () => {
  if (!setupPromise) {
    setupPromise = (async () => {
      try {
        const { startServer } = await import("./src/index.ts");
        await startServer();
      } catch (error) {
        console.error("Failed to start server:", error);
      }
    })();
  }
  await setupPromise;
});

// Cleanup after all tests - just let forceExit handle it
afterAll(async () => {
  // Server will be force-exited by Jest
  // No need to manually close connections with forceExit: true
});
