Feature: DevPulse Standup and Blocker Management
  As a developer
  I want to log standups and report technical blockers
  So that my team and AI assistant can track progress

  Scenario: Successfully submitting a daily standup
    Given the DevPulse backend server is running
    When a developer submits yesterday's work "Completed API routing" and today's plan "Building UI dashboard"
    Then the standup should be saved successfully with status 201

  Scenario: Reporting a blocker with an error log
    Given the DevPulse backend server is running
    When a developer reports a blocker "Database Timeout" with error log "ETIMEDOUT"
    Then the system should generate an AI troubleshooting suggestion