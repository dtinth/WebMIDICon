workflow "todo-actions" {
  on = "push"
  resolves = ["dtinth/todo-actions@576e1d7"]
}

action "dtinth/todo-actions@576e1d7" {
  uses = "dtinth/todo-actions@576e1d7"
  secrets = ["GITHUB_TOKEN", "TODO_ACTIONS_MONGO_URL"]
}
