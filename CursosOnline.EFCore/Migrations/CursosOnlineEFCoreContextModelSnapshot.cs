﻿// <auto-generated />
using System;
using CursosOnline.EFCore.DataContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace CursosOnline.EFCore.Migrations
{
    [DbContext(typeof(CursosOnlineEFCoreContext))]
    partial class CursosOnlineEFCoreContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.10");

            modelBuilder.Entity("CursosOnline.Modelo.Lesson", b =>
                {
                    b.Property<int>("LessonID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Content")
                        .HasColumnType("TEXT");

                    b.Property<TimeSpan?>("Duration")
                        .HasColumnType("TEXT");

                    b.Property<int?>("ModuleID")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.HasKey("LessonID");

                    b.HasIndex("ModuleID");

                    b.ToTable("Lessons");
                });

            modelBuilder.Entity("CursosOnline.Modelo.Module", b =>
                {
                    b.Property<int>("ModuleID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.HasKey("ModuleID");

                    b.ToTable("Modules");
                });

            modelBuilder.Entity("CursosOnline.Modelo.Lesson", b =>
                {
                    b.HasOne("CursosOnline.Modelo.Module", null)
                        .WithMany("Lessons")
                        .HasForeignKey("ModuleID")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("CursosOnline.Modelo.Module", b =>
                {
                    b.Navigation("Lessons");
                });
#pragma warning restore 612, 618
        }
    }
}