package entity

type AboutContent struct {
	ID        int64             `json:"id"`
	Name      map[string]string `json:"name"`
	Username  string            `json:"username"`
	Title     map[string]string `json:"title"`
	Bio       map[string]string `json:"bio"`
	Photo     string            `json:"photo"`
	Stats     []Stat            `json:"stats"`
	UpdatedAt string            `json:"updated_at"`
}

type Stat struct {
	Value map[string]string `json:"value"`
	Label map[string]string `json:"label"`
	Icon  string            `json:"icon"`
	Color string            `json:"color"`
}

type Project struct {
	ID          string            `json:"id"`
	Title       string            `json:"title"`
	Description map[string]string `json:"description"`
	Image       string            `json:"image"`
	Tags        []string          `json:"tags"`
	Links       ProjectLinks      `json:"links"`
	Featured    bool              `json:"featured"`
	Order       int               `json:"order"`
}

type ProjectLinks struct {
	Github string `json:"github,omitempty"`
	Demo   string `json:"demo,omitempty"`
}

type Skill struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Icon  string `json:"icon"`
	Color string `json:"color"`
}

type SkillCategory struct {
	ID       string            `json:"id"`
	Title    map[string]string `json:"title"`
	Skills   []Skill           `json:"skills"`
	Badge    map[string]string `json:"badge,omitempty"`
	Order    int               `json:"order"`
}

type Contact struct {
	ID    string            `json:"id"`
	Type  string            `json:"type"`
	Label map[string]string `json:"label"`
	Value string            `json:"value"`
	Link  string            `json:"link"`
	Icon  string            `json:"icon"`
	Color string            `json:"color"`
	Order int               `json:"order"`
}

type SiteContent struct {
	About      AboutContent    `json:"about"`
	Projects   []Project       `json:"projects"`
	Skills     []SkillCategory `json:"skills"`
	Contacts   []Contact       `json:"contacts"`
}
