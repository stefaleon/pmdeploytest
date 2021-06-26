import axios from 'axios';
import cookie from 'cookie';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '/config/index';
import { Jumbotron, Card, Button, Form } from 'react-bootstrap';
import Layout from '/components/Layout';
import MemberItemAdd from 'components/MemberItemWithAddButton';
import MemberItemRm from 'components/MemberItemWithRemoveButton';
import Loading from 'components/Loading';
import AuthContext from 'context/AuthContext';
import AppContext from 'context/AppContext';

export default function updateTheProjectmembersOfTheProject({
  people,
  project,
  projectMembers,
}) {
  const { user } = useContext(AuthContext);
  const { createProjectMember, deleteProjectMember } = useContext(AppContext);

  const router = useRouter();
  const [selectedMembers, setSelectedMembers] = useState(projectMembers || []);
  const [loading, setLoading] = useState(false);
  const [alreadyAssignedMembersIds, setAlreadyAssignedMembersIds] = useState(
    // create the array of the already assigned members ids from the projectMembers
    // for the initial value
    projectMembers?.map((x) => x.person.id)
  );
  const [
    assignedMembersIdsToRemoveFromDb,
    setAssignedMembersIdsToRemoveFromDb,
  ] = useState([]);

  // also create an array with the current projectMembers ids
  const projectMembersIds = projectMembers?.map((x) => x.id);

  const cancel = () => {
    router.push(`/projects/${project.id}`);
  };

  const addToSelectedMembers = (id) => {
    if (
      selectedMembers.find(
        (m) =>
          // check if it is already selected
          m.id === id ||
          // or already assigned
          alreadyAssignedMembersIds.indexOf(id) !== -1
      )
    ) {
      console.log('already selected or assigned');
      return;
    }
    const member = people.find((p) => p.id === id);
    setSelectedMembers([
      ...selectedMembers,
      {
        id: member.id,
        name: `${member.firstname} ${member.lastname}`,
        project,
        person: member,
      },
    ]);
  };

  const removeFromSelectedMembers = (id) => {
    const filtered = selectedMembers.filter((m) => m.id !== id);
    // console.log('filtered', filtered);
    setSelectedMembers(filtered);

    // also remove it from the already assigned members ids array
    const matchingSelectedMembers = selectedMembers.filter((m) => m.id === id);
    const matchingId = matchingSelectedMembers[0].person?.id;
    const filtered2 = alreadyAssignedMembersIds.filter((x) => x !== matchingId);
    // console.log('filtered2', filtered2);
    setAlreadyAssignedMembersIds(filtered2);

    // also add to the array of projectMembers ids to delete from db
    // but only the formerly assigned
    // not the newly added and right away removed
    // it has to exist inside the projectMembersIds array
    if (projectMembersIds.includes(id)) {
      setAssignedMembersIdsToRemoveFromDb([
        ...assignedMembersIdsToRemoveFromDb,
        id,
      ]);
    }
  };

  const postSelectedMembers = async () => {
    for (const m of selectedMembers) {
      // post only those that are not already assigned
      if (!projectMembersIds.includes(m.id)) {
        try {
          await createProjectMember({
            name: m.name,
            person: m.person,
            project: m.project,
          });
        } catch (error) {
          alert(error);
        }
      }
    }
  };

  const deleteFormerlyAssignedMembersFromDb = async () => {
    for (const id of assignedMembersIdsToRemoveFromDb) {
      try {
        await deleteProjectMember(id);
        console.log('DELETED', id);
      } catch (error) {
        alert(error);
      }
    }
  };

  const updateProjectMembers = async () => {
    try {
      setLoading(true);
      // add selectedMembers to the ProjectMembers collection
      await postSelectedMembers();
      // delete the removed projectMembers
      await deleteFormerlyAssignedMembersFromDb();
      setLoading(false);
      router.push(`/projects/${project.id}`);
    } catch (error) {
      alert(error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Jumbotron>
        <Card className="p-2">
          <Card.Body>
            <div className="jumbo_content">
              <h1>
                <i className="fas fa-project-diagram mr-2"></i>
                {project?.name}
              </h1>
            </div>
          </Card.Body>
        </Card>
        <div className="two_cols">
          <Card className="task_container">
            <Card.Title>People</Card.Title>

            {!people && <Card>Fetch people error</Card>}
            {people?.length === 0 ? (
              <Card>
                <h3 className="p-2">No people found</h3>
              </Card>
            ) : (
              people?.map((p) => (
                <MemberItemAdd
                  key={p.id}
                  m={p}
                  addToSelectedMembers={addToSelectedMembers}
                  project={project}
                />
              ))
            )}
          </Card>
          <Card className="task_container">
            <Card.Title>Assigned Members</Card.Title>
            {selectedMembers.map((m) => (
              <MemberItemRm
                key={m.id}
                m={m}
                removeFromSelectedMembers={removeFromSelectedMembers}
              />
            ))}
            {loading && (
              <Card className="p-2">
                <Loading />
              </Card>
            )}
          </Card>
        </div>
        <Card className="task_container">
          <Button
            variant="success"
            className="update_button"
            size="lg"
            block
            onClick={updateProjectMembers}
          >
            Update Project Members
          </Button>
          <Button
            variant="warning"
            className="cancel_button"
            size="lg"
            block
            onClick={cancel}
          >
            Cancel
          </Button>
        </Card>
      </Jumbotron>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const { token } = cookie.parse(context.req.headers.cookie) || '';
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch all the people
    const peopleRes = await axios.get(`${API_URL}/people`, authConfig);
    console.log(peopleRes.data);
    // Fetch current project
    const projectRes = await axios.get(
      `${API_URL}/projects/${context.params.id}`,
      authConfig
    );

    // Fetch current project's projectMembers
    const projectMembersRes = await axios.get(
      `${API_URL}/project-members?project=${context.params.id}`,
      authConfig
    );

    return {
      props: {
        people: peopleRes.data || [],
        project: projectRes.data || {},
        projectMembers: projectMembersRes.data || [],
      },
    };
  } catch (error) {
    console.log(error.message);
    return {
      props: { message: 'Error: Fetching data failed' },
    };
  }
}
