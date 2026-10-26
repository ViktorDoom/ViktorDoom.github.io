"use strict";

// DOM references
const projectsContainer = document.getElementById("projects-container");
const projectsStatus = document.getElementById("projects-status");

// Data source
const PROJECTS_URL = "data/projects.json";


/**
 * Retrieves project information from the JSON file.
 *
 * @returns {Promise<Array>} Array containing project objects.
 */
async function fetchProjects() {

    const response = await fetch(PROJECTS_URL);

    if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
    }

    const projects = await response.json();

    if (!Array.isArray(projects)) {
        throw new Error("Project data must be an array.");
    }

    return projects;
}


/**
 * Creates an HTML element representing a project.
 *
 * @param {Object} project - Project data.
 * @returns {HTMLElement} Project card.
 */
function createProjectCard(project) {

    // Main card
    const card = document.createElement("article");
    card.classList.add("project-card");

    // Project title
    const title = document.createElement("h2");
    title.textContent = project.title;

    // Short description
    const description = document.createElement("p");
    description.textContent = project.description;

    // Detailed information container
    const details = document.createElement("div");
    details.classList.add("project-details");

    // Detailed description
    const detailedDescription = document.createElement("p");
    detailedDescription.textContent = project.details;

    details.appendChild(detailedDescription);

    // Technologies
    if (Array.isArray(project.technologies) && project.technologies.length > 0) {

        const technologies = document.createElement("ul");
        technologies.classList.add("project-technologies");

        project.technologies.forEach(technology => {

            const item = document.createElement("li");
            item.textContent = technology;

            technologies.appendChild(item);

        });

        details.appendChild(technologies);
    }

    // GitHub repository
    if (project.github) {

        const githubLink = document.createElement("a");

        githubLink.href = project.github;
        githubLink.textContent = "View on GitHub";
        githubLink.target = "_blank";
        githubLink.rel = "noopener noreferrer";

        details.appendChild(githubLink);
    }

    // Assemble card
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(details);

    // Expand/collapse interaction
    card.addEventListener("click", (event) => {

        if (event.target.closest("a")) {
            return;
        }

        card.classList.toggle("expanded");

    });

    return card;
}


/**
 * Renders all project cards in the projects container.
 *
 * @param {Array} projects - Array of project objects.
 */
function renderProjects(projects) {

    // Remove previously rendered projects
    projectsContainer.replaceChildren();

    const fragment = document.createDocumentFragment();

    projects.forEach(project => {

        const card = createProjectCard(project);

        fragment.appendChild(card);

    });

    // Add all cards to the DOM
    projectsContainer.appendChild(fragment);
}


/**
 * Initializes the projects page.
 */
async function initializeProjects() {

    try {

        projectsStatus.textContent = "Loading projects...";

        const projects = await fetchProjects();

        renderProjects(projects);

        projectsStatus.textContent =
            projects.length === 0
                ? "No projects available."
                : "";

    } catch (error) {

        console.error("Error loading projects:", error);

        projectsStatus.textContent =
            "Unable to load projects. Please try again later.";
    }
}


// Start application
initializeProjects();