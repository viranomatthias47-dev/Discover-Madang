# 👥 Team Feature and Page Responsibilities

## 📌 Individual Responsibilities

Each team member must be assigned one webpage or system feature. The assigned member is responsible for:

- Creating the page structure using **HTML**
- Designing and styling the page using **CSS**
- Adding page interactions and functionality using **JavaScript**
- Making the page responsive on mobile, tablet and desktop devices
- Testing the page before it is added to the complete website
- Documenting the completed work in the project `README.md`
- Committing and pushing their own work to the shared GitHub repository

## 📋 Page and Feature Allocation

| Team Member | Assigned Page or Feature | Main Responsibilities | Status |
|---|---|---|---|
| Member 1 | Home Page | Navigation, main content and page layout | Not started |
| Member 2 | About Page | Organisation information and team section | Not started |
| Member 3 | Products/Services Page | Product display, filtering and responsive layout | Not started |
| Member 4 | Contact Page | Contact form, validation and feedback messages | Not started |
| Member 5 | Login/Register Page | User forms, validation and page interactions | Not started |

> Replace the examples with the actual names of team members and their assigned pages or features.

## 💻 GitHub Contribution Requirements

The GitHub commit history will be used as evidence of each member’s contribution.

Every member must:

1. Use their own GitHub account.
2. Work on their assigned page or feature.
3. Commit their work regularly.
4. Use clear and meaningful commit messages.
5. Push their commits to the shared repository.
6. Check the latest version of the project before making changes.
7. Inform the team before editing a file assigned to another member.

Examples of appropriate commit messages:

```text
Add semantic structure to home page
Style navigation and main content
Add mobile navigation behaviour
Validate contact form fields
Fix product grid on small screens
```

Avoid unclear commit messages:

```text
update
changes
work
final
fixed
```

> ⚠️ Each member must commit their own work. One member must not upload or commit another member’s entire page. The repository history must clearly show each member’s contribution.

## 🔄 Working in the Shared Repository

Separate branches are not required. All members may work in the same repository.

Before starting work, run:

```bash
git pull
```

After completing a small section of work, run:

```bash
git add .
git commit -m "Add contact form validation"
git push
```

If Git reports a conflict, do not delete another member’s work. Discuss the conflict with the team and carefully combine the changes.

## 🧪 Required Tests

Each member must test their assigned page or feature.

| Test | What to Check | Expected Result |
|---|---|---|
| 🔗 Navigation | Links, menus and buttons | Each item opens the correct page or section |
| 📱 Responsive design | Mobile, tablet and desktop views | Content adjusts without horizontal scrolling |
| 🧱 HTML validation | HTML structure and syntax | No serious validation errors |
| 🎨 CSS testing | Layout, colours, spacing and text | The page remains readable and consistent |
| ⚙️ JavaScript testing | Buttons, forms and interactions | Features work without console errors |
| 📝 Form validation | Empty or incorrect input | Clear validation messages appear |
| ♿ Accessibility | Labels, headings, alternative text and keyboard access | The page can be understood and operated |
| 🌐 Browser testing | Chrome, Edge and Firefox | The page works consistently |
| 🖼️ Media testing | Images, video and other files | Media loads without broken links |

## 📸 Testing Evidence

Each member must provide:

- Screenshots of the page on mobile, tablet and desktop
- HTML validation results
- Evidence that links, buttons and forms were tested
- Evidence showing no major JavaScript console errors
- A link to the relevant GitHub commits
- A short summary of problems identified and corrected

## 📂 Suggested Project Structure

```text
project/
├── index.html
├── pages/
│   ├── about.html
│   ├── products.html
│   ├── contact.html
│   └── login.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── validation.js
│   └── products.js
├── images/
└── README.md
```

## ✅ Completion Checklist

Before a page or feature is marked as complete, the assigned member must confirm:

- [ ] The page uses semantic HTML.
- [ ] The page has consistent CSS styling.
- [ ] The required JavaScript functionality works.
- [ ] The page is responsive.
- [ ] All links and images work.
- [ ] Forms provide clear validation messages.
- [ ] There are no major browser console errors.
- [ ] Accessibility requirements have been checked.
- [ ] Testing evidence has been recorded.
- [ ] Meaningful commits appear under the member’s GitHub account.
- [ ] The latest project version has been pushed to GitHub.

## 🏁 Final Requirement

A member’s contribution will only be recognised when the assigned page or feature has been:

- Implemented using HTML, CSS and JavaScript
- Tested successfully
- Documented in the project
- Committed using the member’s own GitHub account
- Clearly recorded in the repository’s commit history

After all pages have been completed, the team must test the full website to ensure that its design, navigation and functionality are consistent.
