// __tests__/App.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import App from "../App";
import SkillShareForm from "../components/SkillShareForm";
import SkillShareList from "../components/SkillShareList";
import Header from "../components/Header";

jest.mock("axios");

const mockSkillShares = [
  { 
    id: 1, 
    skillName: "React Development", 
    category: "Technology", 
    skillLevel: "Advanced", 
    userEmail: "john@example.com",
    description: "Teaching modern React with hooks and context",
    availability: "Available"
  },
  { 
    id: 2, 
    skillName: "Guitar Playing", 
    category: "Music", 
    skillLevel: "Intermediate", 
    userEmail: "sarah@example.com",
    description: "Acoustic guitar lessons for beginners and intermediate players",
    availability: "Evenings"
  },
  { 
    id: 3, 
    skillName: "Digital Painting", 
    category: "Arts & Crafts", 
    skillLevel: "Expert", 
    userEmail: "mike@example.com",
    description: "Professional digital art techniques using Photoshop and Procreate",
    availability: "Weekend Only"
  },
];

// ----------------- HEADER TESTS -----------------
describe("Header Component", () => {
  test("renders title", () => {
    render(<Header />);
    expect(screen.getByText("Community Skill Sharing Network")).toBeInTheDocument();
  });

  test("renders tagline", () => {
    render(<Header />);
    expect(screen.getByText("Share • Learn • Connect • Grow together")).toBeInTheDocument();
  });
});

// ----------------- SKILLSHARE FORM TESTS -----------------
describe("SkillShareForm Component", () => {
  test("renders add skill share form", () => {
    render(<SkillShareForm onAdd={jest.fn()} setError={jest.fn()} />);
    expect(screen.getByText("Add Skill Share")).toBeInTheDocument();
  });

  test("submits new skill share successfully", async () => {
    axios.post.mockResolvedValue({ data: { id: 4 } });
    const onAddMock = jest.fn();

    render(<SkillShareForm onAdd={onAddMock} setError={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("Skill name"), { target: { value: "Python Programming", name: "skillName" } });
    fireEvent.change(screen.getByPlaceholderText("Your email"), { target: { value: "dev@example.com", name: "userEmail" } });
    fireEvent.change(screen.getByPlaceholderText("Describe your skill and what you can teach..."), { target: { value: "Teaching Python fundamentals", name: "description" } });

    fireEvent.click(screen.getByText("Add Skill Share"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(onAddMock).toHaveBeenCalled();
    });
  });

  test("handles API error on add", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));
    const setErrorMock = jest.fn();
    render(<SkillShareForm onAdd={jest.fn()} setError={setErrorMock} />);

    fireEvent.change(screen.getByPlaceholderText("Skill name"), { target: { value: "Java Programming", name: "skillName" } });
    fireEvent.click(screen.getByText("Add Skill Share"));

    await waitFor(() => expect(setErrorMock).toHaveBeenCalled());
  });

  test("loads skill share data for editing", async () => {
    axios.get.mockResolvedValue({ data: mockSkillShares[0] });
    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<SkillShareForm onAdd={jest.fn()} setError={jest.fn()} editId="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("React Development"));
    expect(screen.getByDisplayValue("React Development")).toBeInTheDocument();
    expect(screen.getByText("Update Skill Share")).toBeInTheDocument();
  });

  test("updates skill share successfully", async () => {
    axios.get.mockResolvedValue({ data: mockSkillShares[0] });
    axios.put.mockResolvedValue({ data: { ...mockSkillShares[0], skillLevel: "Expert" } });
    const onAddMock = jest.fn();

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<SkillShareForm onAdd={onAddMock} setError={jest.fn()} editId="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("React Development"));

    fireEvent.change(screen.getByDisplayValue("Advanced"), { target: { value: "Expert", name: "skillLevel" } });
    fireEvent.click(screen.getByText("Update Skill Share"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
      expect(onAddMock).toHaveBeenCalled();
    });
  });



  test("form validation: empty fields", async () => {
    const setErrorMock = jest.fn();
    render(<SkillShareForm onAdd={jest.fn()} setError={setErrorMock} />);

    fireEvent.click(screen.getByText("Add Skill Share"));
    await waitFor(() => expect(setErrorMock).toHaveBeenCalled());
  });



  test("updates skill name correctly", async () => {
    axios.get.mockResolvedValue({ data: mockSkillShares[0] });
    axios.put.mockResolvedValue({ data: { ...mockSkillShares[0], skillName: "Advanced React Development" } });
    const onAddMock = jest.fn();

    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<SkillShareForm onAdd={onAddMock} setError={jest.fn()} editId="1" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue("React Development"));
    fireEvent.change(screen.getByDisplayValue("React Development"), { target: { value: "Advanced React Development", name: "skillName" } });
    fireEvent.click(screen.getByText("Update Skill Share"));

    await waitFor(() => expect(onAddMock).toHaveBeenCalled());
  });


  test("handles empty email field validation", async () => {
    const setErrorMock = jest.fn();
    render(<SkillShareForm onAdd={jest.fn()} setError={setErrorMock} />);
    fireEvent.change(screen.getByPlaceholderText("Skill name"), { target: { value: "Test Skill", name: "skillName" } });
    fireEvent.click(screen.getByText("Add Skill Share"));
    await waitFor(() => expect(setErrorMock).toHaveBeenCalledWith("User email is required"));
  });

  test("handles invalid email format validation", async () => {
    const setErrorMock = jest.fn();
    render(<SkillShareForm onAdd={jest.fn()} setError={setErrorMock} />);
    fireEvent.change(screen.getByPlaceholderText("Skill name"), { target: { value: "Test Skill", name: "skillName" } });
    fireEvent.change(screen.getByPlaceholderText("Your email"), { target: { value: "invalid-email", name: "userEmail" } });
    fireEvent.click(screen.getByText("Add Skill Share"));
    await waitFor(() => expect(setErrorMock).toHaveBeenCalledWith("Please provide a valid email"));
  });


});

// ----------------- SKILLSHARE LIST TESTS -----------------
describe("SkillShareList Component", () => {
  test("renders skill sharing community heading", () => {
    render(<MemoryRouter><SkillShareList skillShares={[]} onChange={jest.fn()} /></MemoryRouter>);
    expect(screen.getByText("Skill Sharing Community")).toBeInTheDocument();
  });


  test("renders empty state when no skill shares", () => {
    render(<MemoryRouter><SkillShareList skillShares={[]} onChange={jest.fn()} /></MemoryRouter>);
    expect(screen.getByText("No skill shares found. Be the first to share your skills!")).toBeInTheDocument();
  });

  
});