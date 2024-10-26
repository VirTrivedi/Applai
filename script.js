// Dictionary to hold applicants for each job title
const jobApplicants = {};

// Function to toggle views
function toggleView() {
    const companyView = document.getElementById('companyView');
    const applicantView = document.getElementById('applicantView');
    const toggleButton = document.getElementById('toggleViewButton');

    if (companyView.style.display === 'none') {
        companyView.style.display = 'block';
        applicantView.style.display = 'none';
        toggleButton.textContent = 'Switch to Applicant View';
    } else {
        companyView.style.display = 'none';
        applicantView.style.display = 'block';
        toggleButton.textContent = 'Switch to Company View';
        populateApplicantView(); // Populate job postings in applicant view
    }
}

// Function to populate job postings in the company view with applicant lists
function populateCompanyView() {
    const jobList = document.getElementById('jobList');
    jobList.innerHTML = ''; // Clear existing content

    const jobTitles = Object.keys(jobApplicants);
    jobTitles.forEach(jobTitle => {
        const jobDetails = jobApplicants[jobTitle];
        const jobDescription = jobDetails.description || "No job description"; // Default message

        const jobCard = document.createElement('div');
        jobCard.className = 'job-posting';
        jobCard.innerHTML = `
            <h3>${jobTitle}</h3>
            <p>${jobDescription}</p>
            <p>Company: ${jobDetails.company}</p>
            <p>Location: ${jobDetails.location}</p>
            <ul class="applicantList"></ul>
        `;
        jobList.appendChild(jobCard);

        // Add click event to open applicant modal
        jobCard.addEventListener('click', function () {
            if (document.getElementById('companyView').style.display === 'block') {
                openApplicantModal(jobTitle);
            }
        });

        // Display applicants without the option to add new ones
        displayApplicants(jobTitle, jobCard.querySelector('.applicantList'), false);
    });
}

// Function to open the applicant modal and display applicants for a job
function openApplicantModal(jobTitle) {
    const modal = document.getElementById('applicantModal');
    const modalApplicantList = document.getElementById('modalApplicantList');

    // Clear existing applicants and populate with new data
    modalApplicantList.innerHTML = '';
    const applicants = jobApplicants[jobTitle].applicants || [];
    applicants.forEach(applicant => {
        const li = document.createElement('li');
        li.textContent = `${applicant.name}`;
        const resumeLink = document.createElement('a');
        resumeLink.href = applicant.resume;
        resumeLink.target = "_blank";
        resumeLink.textContent = "View Resume";
        li.appendChild(resumeLink);
        modalApplicantList.appendChild(li);
    });

    // Show the modal
    modal.style.display = 'flex';
}

// Function to close the applicant modal
function closeApplicantModal() {
    const modal = document.getElementById('applicantModal');
    modal.style.display = 'none';
}

// Function to populate job postings in the applicant view with an apply form
function populateApplicantView() {
    const applicantJobList = document.getElementById('applicantJobList');
    applicantJobList.innerHTML = ''; // Clear existing content

    const jobTitles = Object.keys(jobApplicants);
    jobTitles.forEach(jobTitle => {
        const jobDetails = jobApplicants[jobTitle];
        const jobDescription = jobDetails.description || "No job description"; // Default message

        const jobCard = document.createElement('div');
        jobCard.className = 'job-posting';
        jobCard.innerHTML = `
            <h3>${jobTitle}</h3>
            <p>${jobDescription}</p>
            <p>Company: ${jobDetails.company}</p>
            <p>Location: ${jobDetails.location}</p>
            <h4>Apply</h4>
            <input type="text" placeholder="Applicant Name" class="applicantName" required>
            <input type="file" accept=".pdf" class="applicantResume" required>
            <button class="applyButton">Apply</button>
        `;
        applicantJobList.appendChild(jobCard);

        // Event listener to add new applicants
        jobCard.querySelector('.applyButton').addEventListener('click', function () {
            const applicantName = jobCard.querySelector('.applicantName').value;
            const applicantResume = jobCard.querySelector('.applicantResume').files[0];

            if (applicantName && applicantResume) {
                if (applicantResume.type === "application/pdf") {
                    jobApplicants[jobTitle].applicants.push({
                        name: applicantName,
                        resume: URL.createObjectURL(applicantResume), // Create a URL for the uploaded PDF
                    });

                    jobCard.querySelector('.applicantName').value = '';
                    jobCard.querySelector('.applicantResume').value = '';
                    alert("Application submitted successfully!");
                } else {
                    alert('Please upload a valid PDF document for your resume.');
                }
            }
        });
    });
}

function displayApplicants(jobTitle, applicantListDiv) {
    const applicants = jobApplicants[jobTitle].applicants || [];
    applicantListDiv.innerHTML = ''; // Clear existing content

    applicants.forEach(applicant => {
        const li = document.createElement('li');
        li.textContent = `${applicant.name}`;
        const resumeLink = document.createElement('a');
        resumeLink.href = applicant.resume;
        resumeLink.target = "_blank";
        resumeLink.textContent = "View Resume";
        li.appendChild(resumeLink);
        applicantListDiv.appendChild(li);
    });
}

// Event listener to close the modal
document.getElementById('closeModal').addEventListener('click', closeApplicantModal);

// Event listener for job form submission
document.getElementById('jobForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting the traditional way

    // Get form values
    const jobTitle = document.getElementById('jobTitle').value;
    const companyName = document.getElementById('companyName').value;
    const location = document.getElementById('location').value;
    const jobDescription = document.getElementById('jobDescription').value;

    // Initialize the job applicants array if it doesn't exist
    if (!jobApplicants[jobTitle]) {
        jobApplicants[jobTitle] = { 
            description: jobDescription, 
            company: companyName, 
            location: location,
            applicants: [] 
        };
    }

    // Create a new job posting element
    const jobPosting = document.createElement('div');
    jobPosting.className = 'job-posting';
    jobPosting.onclick = function () {
        viewJobDetails(jobTitle, jobDescription);
    };
    jobPosting.innerHTML = `
        <h2>${jobTitle}</h2>
        <p>${companyName}</p>
        <p>Location: ${location}</p>
        <!-- Job Description is removed from here -->
    `;

    // Add the new job posting to the job list
    document.getElementById('jobList').appendChild(jobPosting);

    populateCompanyView();
    // Clear the form fields
    document.getElementById('jobForm').reset();
});

// Add the toggle view event listener
document.getElementById('toggleViewButton').addEventListener('click', toggleView);

populateCompanyView();