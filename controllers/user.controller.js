
export const getProfile = async (req, res,) => {
    const user = req.user;
    try {
        if (!user) {
            return res.status(401).json({message: "User not found"});
        }
        return res.status(200).json({
            id: user.id, name: user.name, email: user.email,
        });
    } catch (err) {
        return res.status(500).json({message: "Internal Server Error"});
    }

}
