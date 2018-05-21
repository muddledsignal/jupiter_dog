#Communication plan: 

##How will your group communicate with each other? 
Mostly slack, but we will be working together (in person) for the majority of the time.


##What is your strategy for ensuring everyone's voices are heard, and that contributions from both loud and soft voices are listened to?
Everyone will make sure to acknowledge suggestions in some way, even just a quick response on slack or through texting. If someone feels unheard, they can say "I don't feel heard right now" and everyone will make sure to pay more attention.


##Do you have a plan for managing psychological safety, as we learned about in the article on Google and teams and discussing it with Brook?
Asking for input from teammates.
Asking a specific teammate what they think if they did not give input.
Making sure to apologize if we accidentally interrupt each other.


#Conflict plan: g
##What will your group do when it encounters conflict? What will your process be to resolve it?
Remind ourselves and each other to take breaks to help prevent frustration.
If a discussion gets heated, step away for 15 minutes to cool off and then come back to the discussion.
Ask for moderator, if needed.


#Work plan: 
##How you will identify tasks, assign tasks, know when they are complete, and manage work in general?
In particular, make sure you know how you'll track whether everyone is contributing equally to the JavaScript, CSS, and HTML portions, and that each person is working on "meaty" problems.


###Identify Tasks:
Look at technical requirements, determine what exactly needs to be done in code. Break work down to 30 minute to 2-hour chunks. Each chunk will be a task/issue on GitHub.

For each task, create a card in the GitHub project, and turn each one into a GitHub issue. In the issue, give a brief explanation of what needs to be done and reference wireframes/data models/etc. if necessary. Assign an issue to a person so they can work on it.

Arrange To Do's in order of what needs to be completed first, taking into consideration what issues will block others.

Achieve HTML and JS MVP first, then CSS last.

###Assign Tasks:
Teammates will volunteer/choose tasks from the list, making sure to not choose tasks that are dependent on others that have yet to be completed.
If a teammate ends up beginning a task that is dependent on an unfinished task, they will stop the task or flag dependencies they need.

###Know When They are Complete:
Tasks will move from the To Do list to the In Progress list to the Done list, but team members will also notify others in slack after completing a task.

###Track Whether Everyone is Contributing Equally:
Each category may have a team member leading it. The lead would make To Do's and then pass it off to another teammate so they can work on "meaty" problems, but still have direction.

###Manage Work in General:

Team members will try to always work on non-master branches.
Team members will make frequent commits. Good times to do this are after getting a feature to work and before making any big changes.

The Launch Driver will be Suzanne. Only the Lauch Driver can merge pull requests to master, and will let the team know when she merges.
All team members CAN push to their personal branches at any time.



#Git process: 
##What is your Git flow?

###Start from up-to-date master branch
git checkout master
git pull origin master

###Create new feature branch
git checkout -b <branchname>

###Work on feature branch
git add <file>
git commit -m <useful message>
git push origin <branchname>

###On GitHub
Create pull request
Launch Driver reviews PR and merges to master

##Merge Party!
WHEN A PULL REQUEST FROM SOMEONE ELSE'S <FEATURE BRANCH> IS MERGED TO MASTER, EVERYONE MUST DO THESE STEPS

###Commit changes to your feature branch
git add <file>
git commit -m <useful message>

###Update your local master branch
git checkout master
git pull origin master

###Update your feature branch with changes in master
git checkout <feature_branch_name>
git merge master

###handle merge conflicts if there are any
Check all of your project files for the markers that indicate merge conflicts (in other words, the >>>>>>>>> and HEAD stuff that has mysteriously appeared in your code)

###Edit the code to remove the redundancies causing the merge conflict, and eliminate the markers
git add <affected-files>
git commit -m "merged master"



##How many people must review a PR? Who merges PRs?
Only the Launch Driver must review PR's and merge.

##Any thing else you feel is important: expectations around work times, standup times, taking breaks/seeking help when you're stuck, etc.
Available between 9am-6pm
On campus at least 10am-12pm
Group together 10am-4pm

Can be flexible. Part of the team could decide to go work at a coffee shop for a while, and if any team members prefer to stay on campus, they can do so if the work allows.