import React, { useContext, useState } from "react";
import { Modal } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";
import apiServer from "../../config/apiServer";
import { Context as TeamContext } from "../../context/store/TeamStore";
import { Context as ProjectContext } from "../../context/store/ProjectStore";
import "../../css/Forms.css";


const ProjectForm = ({
  handleNewClose,
  clickClose,
  open,
  setTeamProjects,
  showSideProjectForm,
}) => {
  const { register, handleSubmit, errors, clearErrors } = useForm();
  const [projectName, setProjectName] = useState();
  const [teamState, teamdispatch] = useContext(TeamContext);
  const [projectState, projectdispatch] = useContext(ProjectContext);
  const teamId = "";
  const [projectID, setProjectID] = useState(generateRandomId());
  
  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  };



  const userId = localStorage.getItem("userId");

  const handleNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleUserKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async ({ ProjectName, Description, StartDate, EndDate, Status }) => {
    await apiServer.post(`http://localhost:3000/project`, {
      ProjectID : projectID,
      ProjectName : ProjectName,
      Description : Description,
      StartDate : StartDate,
      EndDate : EndDate,
      Status : Status,
    });

    const res = await apiServer.get(`/project/user/${userId}`);
    await projectdispatch({ type: "get_user_projects", payload: res.data });
    const projectResponse = await apiServer.get(`/team/${teamId}`);
    await teamdispatch({
      type: `get_team_projects${teamId}`,
      payload: projectResponse.data,
    });
    if (setTeamProjects) {
      const teamResponse = await apiServer.get(`/team/${teamId}`);
      setTeamProjects(teamResponse.data.Projects);
    }

    showSideProjectForm();
  };

  const clearError = () => {
    var teamSelect = document.getElementById("team-select");
    clearErrors(teamSelect.name);
  };

  const renderedTeams = teamState.teams.map((team, i) => {
    return (
      <option key={i} id={team.id} value={team.id}>
        {team.name}
      </option>
    );
  });

  return (
    <>
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-top-container">
          <div className="form-section">
            <div className="label-container">
              <label className="form-label">Project Name</label>
            </div>
            <div className="input-container">
              <input
                name="ProjectName"
                type="text"
                placeholder={"Project Name"}
                className="form-input"
                onChange={handleNameChange}
                onKeyPress={handleUserKeyPress}
                ref={register({ required: true })}
              />
              {errors.name?.type === "required" && (
                <p className="error-message">Please fill out project name</p>
              )}
            </div>
            <div className="label-container">
              <label className="form-label">Description</label>
            </div>
            <div className="input-container">
              <input
                name="Description"
                type="text"
                placeholder={"Description"}
                className="form-input"
                ref={register}
              />
            </div>
            <div className="label-container">
              <label className="form-label">Start Date</label>
            </div>
            <div className="input-container">
              <input
                name="StartDate"
                type="date"
                className="form-input"
                ref={register}
              />
            </div>
            <div className="label-container">
              <label className="form-label">End Date (optional)</label>
            </div>
            <div className="input-container">
              <input
                name="EndDate"
                type="date"
                className="form-input"
                ref={register}
              />
            </div>
            <div className="label-container">
              <label className="form-label">Status (optional)</label>
            </div>
            <div className="input-container">
              <input
                name="Status"
                type="text"
                placeholder={"Status"}
                className="form-input"
                ref={register}
              />
            </div>
          </div>
        </div>

        <div className="form-button-container">
          <button
            className="cancel-button"
            onClick={showSideProjectForm}
            color="primary"
          >
            Cancel
          </button>
          <button
            className={
              projectName ? "submit-button enabled" : "submit-button disabled"
            }
            disabled={projectName ? false : true}
            type="submit"
          >
            Create Project
          </button>
        </div>
      </form>
    </>
  );
};

export default ProjectForm;