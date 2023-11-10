BEGIN
    IF :APEX$ROW_STATUS = 'C' THEN
        -- Call the CreateProfessor procedure to insert the new professor
        CreateProfessor(
            p_first_name       => :FIRST_NAME,
            p_last_name        => :LAST_NAME,
            p_user_name        => :USER_NAME,
            p_email            => :EMAIL,
            p_department_id    => :DEPARTMENT_ID,
            p_salary           => :SALARY,
            p_work_hours       => :WORK_HOURS,
            p_title            => :TITLE
        );

    ELSIF :APEX$ROW_STATUS = 'U' THEN
        -- Call the UpdateProfessor procedure to update the professor
        UpdateProfessor(
            p_user_id          => :USER_ID,
            p_first_name       => :FIRST_NAME,
            p_last_name        => :LAST_NAME,
            p_user_name        => :USER_NAME,
            p_email            => :EMAIL,
            p_department_id    => :DEPARTMENT_ID,
            p_salary           => :SALARY,
            p_work_hours       => :WORK_HOURS,
            p_title            => :TITLE
        );

    ELSIF :APEX$ROW_STATUS = 'D' THEN
        -- Call the DeleteProfessor procedure to delete the professor
        DeleteProfessor(p_user_id => :USER_ID);
    END IF;
END;
